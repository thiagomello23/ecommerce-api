import { Action } from "src/casl/enums/casl-action";
import { Permissions } from "src/permissions/permissions.entity";
import { UserRole } from "src/roles/enums/user-role";
import { Roles } from "src/roles/roles.entity";
import { DeepPartial, MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissions1738511206202 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const permissions: DeepPartial<Permissions[]> = [
            // All
            {
                action: Action.Manage,
                subject: "all",
            },
            // Validate
            {
                action: Action.Read,
                subject: "Validate",
            },
            {
                action: Action.Update,
                subject: "Validate",
            },
            // Users
            {
                action: Action.Create,
                subject: "Users",
            },
            {
                action: Action.Update,
                subject: "Users"
            }
        ]
        
        await queryRunner.manager.save(Permissions, [...permissions])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(Permissions)
            .execute()
    }
}
