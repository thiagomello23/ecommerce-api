import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Users } from './users.entity';
import { DatabaseRepositoryConstants, microservicesRMQKey } from 'src/constants';
import { CreateUserClientDto } from './dto/create-user-client.dto';
import * as bcrypt from "bcrypt"
import { Roles } from 'src/roles/roles.entity';
import { UserRole } from 'src/roles/enums/user-role';
import { ClientProxy } from '@nestjs/microservices';
import { create } from 'domain';
import { generateVerificationCode } from 'src/auth/helper/generate-verification-code.helper';
import { CreateUserVendor } from './dto/create-user-vendor.dto';
import { Vendors } from 'src/vendor/vendors.entity';
import { VendorsService } from 'src/vendor/vendors.service';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class UsersService {

    constructor(
        @Inject(DatabaseRepositoryConstants.usersRepository)
        private usersRepository: Repository<Users>,
        @Inject(DatabaseRepositoryConstants.rolesRepository)
        private rolesRepository: Repository<Roles>,
        @Inject(microservicesRMQKey.MESSAGE_QUEUE)
        private readonly messageMs: ClientProxy,
        @Inject(DatabaseRepositoryConstants.dataSource)
        private readonly dataSource: DataSource,
        private readonly vendorsService: VendorsService,
        private readonly addressService: AddressService
    ){}

    // By default creates a user with just "USER" role
    async createClientUser(createUser: CreateUserClientDto) {
        const newUser = new Users();

        const existingUser = await this.usersRepository
            .createQueryBuilder("users")
            .where("users.phoneNumber = :phoneNumber", {phoneNumber: createUser.phoneNumber})
            .orWhere("users.email = :email", {email: createUser.email})
            .getOne()

        if(existingUser) {
            throw new BadRequestException("User email or phone number already beeing used;")
        }

        const criptPassword = await bcrypt.hash(createUser.password, +process.env.BCRYPT_SALT)

        newUser.firstName = createUser.firstName
        newUser.lastName = createUser.lastName
        newUser.email = createUser.email
        newUser.phoneNumber = createUser.phoneNumber
        newUser.password = criptPassword
        newUser.verificatedUserEmail = false;
        newUser.emailVerificationCode = generateVerificationCode()

        const roleUser = await this.rolesRepository.findOne({
            where: {
                role: UserRole.CLIENT
            }
        })

        newUser.roles = [roleUser]

        const queryRunner = this.dataSource.createQueryRunner()

        let returnCreatedUser;

        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            returnCreatedUser = await queryRunner.manager.save(newUser)
            await queryRunner.commitTransaction()
        } catch(err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            if(!queryRunner.isReleased){
                await queryRunner.release()
            }
        }

        await this.messageMs.send(
            microservicesRMQKey.SEND_EMAIL_ACCOUNT_VERIFICATION, 
            {
                userEmail: returnCreatedUser.email,
                verificationCode: returnCreatedUser.emailVerificationCode,
                firstName: returnCreatedUser.firstName,
                lastName: returnCreatedUser.lastName
            }
        ).toPromise()

        return returnCreatedUser
    }

    async createVendorUser(createVendorUser: CreateUserVendor) {
        const newVendorUser = new Users()

        const existingUser = await this.usersRepository
            .createQueryBuilder("users")
            .where("users.phoneNumber = :phoneNumber", {phoneNumber: createVendorUser.phoneNumber})
            .orWhere("users.email = :email", {email: createVendorUser.email})
            .getOne()

        if(existingUser) {
            throw new BadRequestException("User email or phone number already beeing used;")
        }

        const criptPassword = await bcrypt.hash(createVendorUser.password, +process.env.BCRYPT_SALT)

        newVendorUser.firstName = createVendorUser.firstName
        newVendorUser.lastName = createVendorUser.lastName
        newVendorUser.email = createVendorUser.email
        newVendorUser.phoneNumber = createVendorUser.phoneNumber
        newVendorUser.password = criptPassword
        newVendorUser.verificatedUserEmail = false;
        newVendorUser.emailVerificationCode = generateVerificationCode()

        const vendorRole = await this.rolesRepository.findOne({
            where: {
                role: UserRole.VENDOR
            }
        })

        const clientRole = await this.rolesRepository.findOne({
            where: {
                role: UserRole.CLIENT
            }
        })

        newVendorUser.roles = [vendorRole, clientRole]

        const newVendor = await this.vendorsService.createVendor(createVendorUser.vendor)

        // Transaction to save user and vendor data
        const queryRunner = this.dataSource.createQueryRunner()

        try {
            // Start transaction
            await queryRunner.connect()
            await queryRunner.startTransaction()

            // Save new user
            await queryRunner.manager.save(newVendorUser)

            // Save new vendor
            newVendor.user = newVendorUser;
            await queryRunner.manager.save(newVendor)

            // Validate address
            const mappedAddress = await this.addressService.mapAddressWithoutUser(createVendorUser.address)
            const validAddress = await this.addressService.validateAddress(mappedAddress)

            if(!validAddress) {
                throw new BadRequestException("Invalid Address!")
            }

            // Save address
            mappedAddress.user = newVendorUser
            await queryRunner.manager.save(mappedAddress)
            await queryRunner.commitTransaction()
        } catch(err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            if(!queryRunner.isReleased){
                await queryRunner.release()
            }
        }

        // For now just sending email verification
        await this.messageMs.send(
            microservicesRMQKey.SEND_EMAIL_ACCOUNT_VERIFICATION, 
            {
                userEmail: newVendorUser.email,
                verificationCode: newVendorUser.emailVerificationCode,
                firstName: newVendorUser.firstName,
                lastName: newVendorUser.lastName
            }
        ).toPromise()

        return newVendorUser
    }

    // For admins are not need for email verification
    async createAdminUser(createAdminUser: CreateUserClientDto) {
        const newAdminUser = new Users();

        const existingUser = await this.usersRepository
            .createQueryBuilder("users")
            .where("users.phoneNumber = :phoneNumber", {phoneNumber: createAdminUser.phoneNumber})
            .orWhere("users.email = :email", {email: createAdminUser.email})
            .getOne()

        if(existingUser) {
            throw new BadRequestException("User email or phone number already beeing used;")
        }

        const criptPassword = await bcrypt.hash(createAdminUser.password, +process.env.BCRYPT_SALT)

        newAdminUser.firstName = createAdminUser.firstName
        newAdminUser.lastName = createAdminUser.lastName
        newAdminUser.email = createAdminUser.email
        newAdminUser.phoneNumber = createAdminUser.phoneNumber
        newAdminUser.password = criptPassword
        newAdminUser.verificatedUserEmail = true
        newAdminUser.emailVerificationCode = null

        const adminRole = await this.rolesRepository.findOne({
            where: {
                role: UserRole.ADMIN
            }
        })

        newAdminUser.roles = [adminRole]

        return this.usersRepository.save(newAdminUser)
    }
}
