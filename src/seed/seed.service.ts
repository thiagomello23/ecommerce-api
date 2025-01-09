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

    }
}