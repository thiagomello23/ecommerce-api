import { Permissions } from "src/permissions/permissions.entity";
import { Roles } from "src/roles/roles.entity";
import { Users } from "src/users/users.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class ResetRolesPermissionsDefaultUser1738511206200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        if(process.env.ENVIRONMENT !== "dev") {
            return;
        }

        // Clear users, roles and permissions just for dev process
        await queryRunner.manager.delete(Roles, {})
        await queryRunner.manager.delete(Users, {})
        await queryRunner.manager.delete(Permissions, {})
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
// 1738511206200-ResetRolesPermissionsDefaultUser