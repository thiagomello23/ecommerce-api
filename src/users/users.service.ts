import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { plainToClass, plainToInstance } from 'class-transformer';
import { FilesService } from 'src/files/files.service';
import { UpdateUserProfile } from './dto/update-user-profile.dto';

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
        private readonly addressService: AddressService,
        private readonly filesService: FilesService
    ){}

    // By default creates a user with just "USER" role
    async createClientUser(createUser: CreateUserClientDto) {
        const existingUser = await this.usersRepository
            .createQueryBuilder("users")
            .where("users.phoneNumber = :phoneNumber", {phoneNumber: createUser.phoneNumber})
            .orWhere("users.email = :email", {email: createUser.email})
            .getOne()

        if(existingUser) {
            throw new BadRequestException("User email or phone number already beeing used;")
        }

        const newUser = plainToInstance(Users, createUser, {excludeExtraneousValues: true})

        const criptPassword = await bcrypt.hash(createUser.password, +process.env.BCRYPT_SALT)

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
        const existingUser = await this.usersRepository
            .createQueryBuilder("users")
            .where("users.phoneNumber = :phoneNumber", {phoneNumber: createVendorUser.phoneNumber})
            .orWhere("users.email = :email", {email: createVendorUser.email})
            .getOne()

        if(existingUser) {
            throw new BadRequestException("User email or phone number already beeing used;")
        }

        const newVendorUser = plainToInstance(Users, createVendorUser, {excludeExtraneousValues: true})

        const criptPassword = await bcrypt.hash(createVendorUser.password, +process.env.BCRYPT_SALT)

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

            mappedAddress.defaultAddress = createVendorUser.address.defaultAddress

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
        const existingUser = await this.usersRepository
            .createQueryBuilder("users")
            .where("users.phoneNumber = :phoneNumber", {phoneNumber: createAdminUser.phoneNumber})
            .orWhere("users.email = :email", {email: createAdminUser.email})
            .getOne()

        if(existingUser) {
            throw new BadRequestException("User email or phone number already beeing used;")
        }

        const newAdminUser = plainToInstance(Users, createAdminUser, {excludeExtraneousValues: true})

        const criptPassword = await bcrypt.hash(createAdminUser.password, +process.env.BCRYPT_SALT)

        newAdminUser.password = criptPassword
        newAdminUser.verificatedUserEmail = true
        newAdminUser.emailVerificationCode = null
        newAdminUser.verificatedPhoneNumber = true
        newAdminUser.phoneNumberVerificationCode = null

        const adminRole = await this.rolesRepository.findOne({
            where: {
                role: UserRole.ADMIN
            }
        })

        newAdminUser.roles = [adminRole]

        return this.usersRepository.save(newAdminUser)
    }

    async deleteClientUser(user: Users){
        const vendorRole = user.roles?.filter((r) => r.role === UserRole.VENDOR)
        const adminRole = user.roles?.filter((r) => r.role === UserRole.ADMIN)

        if(vendorRole || adminRole) {
            throw new UnauthorizedException("Only clients user could be deleted!")
        }

        const queryRunner = this.dataSource.createQueryRunner()

        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            user.email = `DELETED_${Date.now()}_${user.email}`

            await queryRunner.manager.save(Users, user)

            await queryRunner.manager
                .getRepository(Users)
                .createQueryBuilder("users")
                .softDelete()
                .where("users.id = :id", {id: user.id})
                .execute()

            await queryRunner.commitTransaction()
        } catch(err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            await queryRunner.release()
        }

        return {
            message: "User deleted with success!"
        }
    }

    async deleteVendorUser(user: Users) {
        const vendorRole = user.roles?.filter((r) => r.role === UserRole.VENDOR)

        if(!vendorRole) {
            throw new UnauthorizedException("Only vendors could be deleted!")
        }

        const queryRunner = this.dataSource.createQueryRunner()

        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            user.email = `DELETED_${Date.now()}_${user.email}`

            await queryRunner.manager.save(Users, user)

            await queryRunner.manager
                .getRepository(Users)
                .createQueryBuilder("users")
                .softDelete()
                .where("users.id = :id", {id: user.id})
                .execute()

            await queryRunner.commitTransaction()
        } catch(err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            await queryRunner.release()
        }

        return {
            message: "Vendor deleted with success!"
        }
    }

    async updateUserProfile(
        updateUserProfileDto: UpdateUserProfile, 
        user: Users
    ) {
        const queryRunner = this.dataSource.createQueryRunner()

        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            user.firstName = updateUserProfileDto?.firstName ? updateUserProfileDto?.firstName : user.firstName
            user.lastName = updateUserProfileDto?.lastName ? updateUserProfileDto?.lastName : user.lastName
    
            if(updateUserProfileDto?.file?.filename) {
                const {publicUrl} = await this.filesService.fileUploadGCP(updateUserProfileDto.file)
                user.profilePictureIdName = updateUserProfileDto.file.filename
                user.profilePictureUrl = publicUrl
            }

            await queryRunner.manager.save(user)

            await queryRunner.commitTransaction()
        } catch(err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            if(!queryRunner.isReleased){
                await queryRunner.release()
            }
        }
    }
}
