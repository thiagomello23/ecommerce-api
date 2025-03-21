import { DeepPartial, MigrationInterface, QueryRunner } from "typeorm";
import { Permissions } from "src/permissions/permissions.entity";
import { Action } from "src/casl/enums/casl-action";
import { Roles } from "src/roles/roles.entity";
import { UserRole } from "src/roles/enums/user-role";

export class CreateProductsVariantsPermissionsAndUpdatingRoles1742503390491 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const permissions: DeepPartial<Permissions[]> = [
            {
                action: Action.Create,
                subject: "ProductsVariants"
            },
            {
                action: Action.Update,
                subject: "ProductsVariants",
            },
            {
                action: Action.Delete,
                subject: "ProductsVariants"
            },
            {
                action: Action.Read,
                subject: "ProductsVariants"
            }
        ]

        await queryRunner.manager.save(Permissions, permissions)

        const vendorRole = await queryRunner.manager
            .getRepository(Roles)
            .createQueryBuilder("roles")
            .innerJoinAndSelect("roles.permissions", "permissions")
            .where("roles.role = :role", {role: UserRole.VENDOR})
            .getOne()
        
        permissions.forEach((p) => vendorRole.permissions.push(p as Permissions))

        await queryRunner.manager.save(Roles, [vendorRole])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
