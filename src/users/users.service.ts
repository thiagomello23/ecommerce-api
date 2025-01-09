import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { DatabaseRepositoryConstants } from 'src/constants';
import { CreateUserClientDto } from './dto/create-user-client.dto';
import * as bcrypt from "bcrypt"
import { Roles } from 'src/roles/roles.entity';
import { UserRole } from 'src/roles/enums/user-role';

@Injectable()
export class UsersService {

    constructor(
        @Inject(DatabaseRepositoryConstants.usersRepository)
        private usersRepository: Repository<Users>,
        @Inject(DatabaseRepositoryConstants.rolesRepository)
        private rolesRepository: Repository<Roles>
    ){}

    // By default creates a user with just "USER" role
    async createClientUser(createUser: CreateUserClientDto) {
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

        newUser.email = createUser.email
        // newUser.name = createUser.name
        newUser.password = criptPassword

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
