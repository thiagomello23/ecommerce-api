import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Users } from './users.entity';
import { DatabaseRepositoryConstants, microservicesRMQKey } from 'src/constants';
import { CreateUserClientDto } from './dto/create-user-client.dto';
import * as bcrypt from "bcrypt"
import { Roles } from 'src/roles/roles.entity';
import { UserRole } from 'src/roles/enums/user-role';
import { ClientProxy } from '@nestjs/microservices';
import { create } from 'domain';

@Injectable()
export class UsersService {

    private queryRunner: QueryRunner;

    constructor(
        @Inject(DatabaseRepositoryConstants.usersRepository)
        private usersRepository: Repository<Users>,
        @Inject(DatabaseRepositoryConstants.rolesRepository)
        private rolesRepository: Repository<Roles>,
        @Inject(microservicesRMQKey.MESSAGE_QUEUE)
        private readonly messageMs: ClientProxy,
        @Inject(DatabaseRepositoryConstants.dataSource)
        private readonly dataSource: DataSource
    ){
        this.queryRunner = dataSource.createQueryRunner()
    }

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
        newUser.verificationCode = this.generateVerificationCode()

        const roleUser = await this.rolesRepository.findOne({
            where: {
                role: UserRole.CLIENT
            }
        })

        newUser.roles = [roleUser]

        await this.queryRunner.connect()
        await this.queryRunner.startTransaction()

        let returnCreatedUser;

        try {
            returnCreatedUser = await this.queryRunner.manager.save(newUser)
            await this.queryRunner.commitTransaction()
        } catch(err) {
            await this.queryRunner.rollbackTransaction()
            throw err;
        } finally {
            await this.queryRunner.release()
        }

        await this.messageMs.send(
            "SEND_EMAIL_ACCOUNT_VERIFICATION", 
            {
                userEmail: returnCreatedUser.email,
                verificationCode: returnCreatedUser.verificationCode,
                firstName: returnCreatedUser.firstName,
                lastName: returnCreatedUser.lastName
            }
        ).toPromise()

        return returnCreatedUser
    }

    async createVendorUser(createVendorUser: any) {

    }

    async createAdminUser(createAdminUser: any) {

    }

    generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }    
}
