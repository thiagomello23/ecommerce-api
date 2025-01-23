import { Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { CreateUserClientDto } from "src/users/dto/create-user-client.dto";
import { UsersService } from "src/users/users.service";
import { LoginCredentialsDto } from "./dto/login-credentials.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PoliciesGuard } from "./policies.guard";
import { CheckPolicies } from "./decorators/check-policies.decorator";
import { AppAbility } from "src/casl/casl-ability.factory";
import { Action } from "src/casl/enums/casl-action";
import { Users } from "src/users/users.entity";
import { ClientProxy } from "@nestjs/microservices";
import { microservicesRMQKey } from "src/constants";

@Controller("auth")
export class AuthController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    @Post("signUpClient")
    async signUpClient(
        @Body() createUser: CreateUserClientDto
    ) {
        return this.usersService.createClientUser(createUser)
    }

    @Post("signUpVendor")
    async signUpVendor(){
    }

    @Post("signUpAdmin")
    async signUpAdmin() {

    }

    @Post("login")
    async login(
        @Body() loginCredentials: LoginCredentialsDto
    ) {
        return this.authService.login(loginCredentials)
    }

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "Validate"))
    @Get("validate")
    async validateUser(
        @Req() request
    ) {
        return request.user
    }
}