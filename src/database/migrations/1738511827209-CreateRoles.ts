import { Action } from "src/casl/enums/casl-action";
import { Permissions } from "src/permissions/permissions.entity";
import { UserRole } from "src/roles/enums/user-role";
import { Roles } from "src/roles/roles.entity";
import { MigrationInterface, QueryRunner } from "typeorm";
import { PermissionsSearch } from "types";

export class CreateRoles1738511827209 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create roles and assert permissions
        const adminRole = new Roles()
        adminRole.role = UserRole.ADMIN

        const clientRole = new Roles()
        clientRole.role = UserRole.CLIENT

        const vendorRole = new Roles()
        vendorRole.role = UserRole.VENDOR

        const allP: Permissions[] = await queryRunner.manager
            .getRepository(Permissions)
            .createQueryBuilder()
            .getMany()

        // Map permissions to roles
        // to known what type of permissions have just go to CreatePermissions migration
        adminRole.permissions = [
            this.getPermission(allP, {action: Action.Create, subject: "Users"}),
            this.getPermission(allP, {action: Action.Update, subject: "Validate"}),
            this.getPermission(allP, {action: Action.Read, subject: "Validate"}),
            this.getPermission(allP, {action: Action.Update, subject: "Users"}),
            this.getPermission(allP, {action: Action.Delete, subject: "Users"}),
            this.getPermission(allP, {action: Action.Read, subject: "Address"}),
            this.getPermission(allP, {action: Action.Create, subject: "Category"}),
            this.getPermission(allP, {action: Action.Read, subject: "Category"}),
            this.getPermission(allP, {action: Action.Delete, subject: "Category"}),
            this.getPermission(allP, {action: Action.Manage, subject: "all"}),
        ]

        clientRole.permissions = [
            this.getPermission(allP, {action: Action.Read, subject: "Validate"}),
            this.getPermission(allP, {action: Action.Update, subject: "Users"}),
            this.getPermission(allP, {action: Action.Delete, subject: "Users"}),
            this.getPermission(allP, {action: Action.Create, subject: "Address"}),
            this.getPermission(allP, {action: Action.Update, subject: "Address"}),
            this.getPermission(allP, {action: Action.Delete, subject: "Address"}),
            this.getPermission(allP, {action: Action.Read, subject: "Address"}),
            this.getPermission(allP, {action: Action.Read, subject: "Category"}),
        ]

        vendorRole.permissions = [
            this.getPermission(allP, {action: Action.Read, subject: "Validate"}),
            this.getPermission(allP, {action: Action.Update, subject: "Users"}),
            this.getPermission(allP, {action: Action.Delete, subject: "Users"}),
            this.getPermission(allP, {action: Action.Create, subject: "Address"}),
            this.getPermission(allP, {action: Action.Update, subject: "Address"}),
            this.getPermission(allP, {action: Action.Delete, subject: "Address"}),
            this.getPermission(allP, {action: Action.Read, subject: "Address"}),
            this.getPermission(allP, {action: Action.Read, subject: "Category"}),
            this.getPermission(allP, {action: Action.Create, subject: "Products"}),
            this.getPermission(allP, {action: Action.Read, subject: "Products"}),
            this.getPermission(allP, {action: Action.Update, subject: "Products"}),
        ]

        await queryRunner.manager.save(Roles, [adminRole, clientRole, vendorRole])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

    // Map permissions into roles
    getPermission(p: Array<Permissions>, permissionSearch: PermissionsSearch) {
        return p.filter((perm: Permissions) => {
            if(perm.action === permissionSearch.action.toString() && perm.subject === permissionSearch.subject) {
                return perm
            }
        })[0] // Get only the first permission
    }
}