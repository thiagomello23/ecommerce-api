import { Controller, Delete, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Action } from "src/casl/enums/casl-action";
import { AppAbility } from "src/casl/casl-ability.factory";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";

@ApiTags("users")
@Controller("users")
export class UsersControllers {

    constructor(
        private readonly usersService: UsersService
    ) {}

    @Delete("delete/client")
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "Users"))
    @ApiBearerAuth()
    async deleteClientUser(
        @Req() request
    ) {
        const user = request.user
        return this.usersService.deleteClientUser(user)
    }
}