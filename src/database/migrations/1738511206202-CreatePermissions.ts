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
            },
            {
                action: Action.Delete,
                subject: "Users"
            },
            // Address
            {
                action: Action.Create,
                subject: "Address",
            },
            {
                action: Action.Read,
                subject: "Address",
            },
            {
                action: Action.Delete,
                subject: "Address",
            },
            {
                action: Action.Update,
                subject: "Address",
            },
            // Categories
            {
                action: Action.Create,
                subject: "Category",
            },
            {
                action: Action.Read,
                subject: "Category",
            },
            {
                action: Action.Update,
                subject: "Category",
            },
            {
                action: Action.Delete,
                subject: "Category",
            },
            // Products
            {
                action: Action.Create,
                subject: "Products",
            },
            {
                action: Action.Read,
                subject: "Products",
            },
            {
                action: Action.Update,
                subject: "Products",
                conditions: {
                    fields: ["isValid"],
                    matcher: "equals",
                    value: true
                }
            },
            {
                action: Action.Delete,
                subject: "Products",
                conditions: {
                    fields: ["isValid"],
                    matcher: "equals",
                    value: true
                }
            },
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
