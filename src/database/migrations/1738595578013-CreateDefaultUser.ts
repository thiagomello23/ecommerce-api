import { MigrationInterface, QueryRunner } from "typeorm";
import "dotenv/config";
import { Users } from "src/users/users.entity";
import * as bcrypt from "bcrypt"
import { Roles } from "src/roles/roles.entity";
import { UserRole } from "src/roles/enums/user-role";
import { Vendors } from "src/vendor/vendors.entity";
import { BusinessType } from "src/vendor/enums/business-type.enum";

export class CreateDefaultUser1738595578013 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ADMIN
        const admin = new Users()
        admin.firstName = process.env.ADMIN_FIRSTNAME
        admin.lastName = process.env.ADMIN_LASTNAME
        admin.email = process.env.ADMIN_EMAIL
        admin.phoneNumber = process.env.ADMIN_PHONENUMBER

        const cript = await bcrypt.hash(process.env.ADMIN_PASS, +process.env.BCRYPT_SALT)

        admin.password = cript
        admin.verificatedUserEmail = true
        admin.emailVerificationCode = null
        admin.verificatedPhoneNumber = true
        admin.phoneNumberVerificationCode = null

        const adminRole = await queryRunner.manager
            .getRepository(Roles)
            .createQueryBuilder("roles")
            .where("roles.role = :role", {role: UserRole.ADMIN})
            .getOne()

        admin.roles = [adminRole]

        await queryRunner.manager.save(Users, admin)

        if(process.env.ENVIRONMENT !== "dev") {
            return
        }

        // JUST FOR DEVELOPMENT ONLY
        // CLIENT
        const clientUser = new Users()
        clientUser.firstName = "Test_firstName"
        clientUser.lastName = "Test_lastName"
        clientUser.email = "testclient@gmail.com"
        clientUser.phoneNumber = "198219419375913"

        const criptForClientAndVendor = await bcrypt.hash("123", +process.env.BCRYPT_SALT)

        clientUser.password = criptForClientAndVendor
        clientUser.verificatedUserEmail = true
        clientUser.emailVerificationCode = null
        clientUser.verificatedPhoneNumber = true
        clientUser.phoneNumberVerificationCode = null

        // VENDOR
        const vendorUser = new Users()
        vendorUser.firstName = "Test_firstName"
        vendorUser.lastName = "Test_lastName"
        vendorUser.email = "testvendor@gmail.com"
        vendorUser.phoneNumber = "198219419375914"

        vendorUser.password = criptForClientAndVendor
        vendorUser.verificatedUserEmail = true
        vendorUser.emailVerificationCode = null
        vendorUser.verificatedPhoneNumber = true
        vendorUser.phoneNumberVerificationCode = null

        const vendor = new Vendors()
        vendor.businessName = "Test_vendor"
        vendor.businessType = BusinessType.NON_PROFIT
        vendor.registrationNumber = "123456789"
        vendor.validVendor = true

        const clientRole = await queryRunner.manager
            .getRepository(Roles)
            .createQueryBuilder("roles")
            .where("roles.role = :role", {role: UserRole.CLIENT})
            .getOne()
        
        const vendorRole = await queryRunner.manager
            .getRepository(Roles)
            .createQueryBuilder("roles")
            .where("roles.role = :role", {role: UserRole.VENDOR})
            .getOne()

        clientUser.roles = [clientRole]
        vendorUser.roles = [vendorRole]

        await queryRunner.manager.save(Users, clientUser)
        await queryRunner.manager.save(Users, vendorUser)

        vendor.user = vendorUser

        await queryRunner.manager.save(Vendors, vendor)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
