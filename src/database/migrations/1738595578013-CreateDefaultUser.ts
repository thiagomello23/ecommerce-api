import { MigrationInterface, QueryRunner } from "typeorm";
import "dotenv/config";
import { Users } from "src/users/users.entity";
import * as bcrypt from "bcrypt"
import { Roles } from "src/roles/roles.entity";
import { UserRole } from "src/roles/enums/user-role";

export class CreateDefaultUser1738595578013 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = new Users()
        user.firstName = process.env.ADMIN_FIRSTNAME
        user.lastName = process.env.ADMIN_LASTNAME
        user.email = process.env.ADMIN_EMAIL
        user.phoneNumber = process.env.ADMIN_PHONENUMBER

        const cript = await bcrypt.hash(process.env.ADMIN_PASS, +process.env.BCRYPT_SALT)

        user.password = cript
        user.verificatedUserEmail = true
        user.emailVerificationCode = null
        user.verificatedPhoneNumber = true
        user.phoneNumberVerificationCode = null

        const adminRole = await queryRunner.manager
            .getRepository(Roles)
            .createQueryBuilder("roles")
            .where("roles.role = :role", {role: UserRole.ADMIN})
            .getOne()

        user.roles = [adminRole]

        await queryRunner.manager.save(Users, user)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
