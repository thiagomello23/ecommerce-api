import { Inject, Injectable } from "@nestjs/common";
import { DatabaseRepositoryConstants } from "src/constants";
import { UserRole } from "src/roles/enums/user-role";
import { Roles } from "src/roles/roles.entity";
import { Users } from "src/users/users.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt"
import { Permissions } from "src/permissions/permissions.entity";
import { Action } from "src/casl/enums/casl-action";

@Injectable()
export class SeedService {

    constructor(
        @Inject(DatabaseRepositoryConstants.usersRepository)
        private usersRepository: Repository<Users>,
        @Inject(DatabaseRepositoryConstants.rolesRepository)
        private rolesRepository: Repository<Roles>,
        @Inject(DatabaseRepositoryConstants.permissionsRepository)
        private permissionsRepository: Repository<Permissions>,
    ){}

    async seed() {

        const defaultUser = await this.usersRepository.findOne({
            where: {
                email: "admin@gmail.com"
            }
        })

        if(defaultUser) {
            // console.log("Seed was already run!")
            return;
        }

        // Configure roles
        const adminRole = new Roles()
        adminRole.role = UserRole.ADMIN

        const clientRole = new Roles()
        clientRole.role = UserRole.CLIENT

        const vendorRole = new Roles()
        vendorRole.role = UserRole.VENDOR

        // Configure permissions
        // Admin
        const adminCreateAccountPermission = new Permissions()
        adminCreateAccountPermission.action = Action.Create
        adminCreateAccountPermission.subject = "Users"

        // General
        const validateUserPermission = new Permissions()
        validateUserPermission.action = Action.Read
        validateUserPermission.subject = "Validate"

        await this.permissionsRepository.save(
            [
                adminCreateAccountPermission, 
                validateUserPermission
            ]
        )

        adminRole.permissions = [validateUserPermission, adminCreateAccountPermission]
        clientRole.permissions = [validateUserPermission, ]
        vendorRole.permissions = [validateUserPermission, ]

        await this.rolesRepository.save([
            adminRole,
            clientRole,
            vendorRole
        ])

        // Create sample admin user
        const defaultAdminUser = new Users()
        defaultAdminUser.firstName = process.env.ADMIN_FIRSTNAME
        defaultAdminUser.lastName = process.env.ADMIN_LASTNAME
        defaultAdminUser.phoneNumber = process.env.ADMIN_PHONENUMBER
        defaultAdminUser.email = process.env.ADMIN_EMAIL
        const criptDefaultAdminPass = bcrypt.hashSync(process.env.ADMIN_PASS, +process.env.BCRYPT_SALT) 
        defaultAdminUser.password = criptDefaultAdminPass
        defaultAdminUser.roles = [adminRole]
        defaultAdminUser.verificatedUserEmail = true;

        await this.usersRepository.save(defaultAdminUser)

        // console.log("Seed script run with success!")
    }
}