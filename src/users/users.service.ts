import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { DatabaseRepositoryConstants, microservicesRMQKey } from 'src/constants';
import { CreateUserClientDto } from './dto/create-user-client.dto';
import * as bcrypt from "bcrypt"
import { Roles } from 'src/roles/roles.entity';
import { UserRole } from 'src/roles/enums/user-role';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {

    constructor(
        @Inject(DatabaseRepositoryConstants.usersRepository)
        private usersRepository: Repository<Users>,
        @Inject(DatabaseRepositoryConstants.rolesRepository)
        private rolesRepository: Repository<Roles>,
        @Inject(microservicesRMQKey.MESSAGE_QUEUE)
        private readonly messageMs: ClientProxy
    ){}

    // By default creates a user with just "USER" role
    async createClientUser(createUser: CreateUserClientDto) {
        // Microservice call to email verification
        // Just a test verification
        // return this.messageMs.send("SEND_EMAIL_ACCOUNT_VERIFICATION", {id: 222})

        const newUser = new Users();

        const existingUser = await this.usersRepository.findOne({
            where: {
                email: createUser.email
            }
        })

        if(existingUser) {
            throw new BadRequestException("User email already beeing used;")
        }

        const criptPassword = await bcrypt.hash(createUser.password, +process.env.BCRYPT_SALT)

        newUser.firstName = createUser.firstName
        newUser.lastName = createUser.lastName
        newUser.email = createUser.email
        newUser.phoneNumber = createUser.phoneNumber
        newUser.password = criptPassword
        newUser.createdAt = new Date().toISOString()

        const roleUser = await this.rolesRepository.findOne({
            where: {
                role: UserRole.CLIENT
            }
        })

        newUser.roles = [roleUser]

        return await this.usersRepository.save(newUser)
    }

    async createVendorUser(createVendorUser: any) {

    }

    async createAdminUser(createAdminUser: any) {

    }
}
