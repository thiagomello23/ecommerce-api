import { DeepPartial, MigrationInterface, QueryRunner } from "typeorm";
import { Permissions } from "src/permissions/permissions.entity";
import { Action } from "src/casl/enums/casl-action";

export class CreateProductsVariantsPermissionsAndUpdatingRoles1742503390491 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const permissions: DeepPartial<Permissions[]> = [
            {
                action: Action.Create,
                subject: "ProductsVariants",
                conditions: {
                    fields: ["isActive", "defaultVariant"],
                    matcher: 'equals',
                    value: true,
                    rules: [
                        {
                            field: ""
                        }
                    ]
                }
            }
        ]

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
