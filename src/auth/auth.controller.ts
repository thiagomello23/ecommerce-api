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
import { EmailVerificationDto } from "./dto/email-verification.dto";
import { ResendEmailVerification } from "./dto/resend-email-verification.dto";
import { CreateUserVendor } from "src/users/dto/create-user-vendor.dto";
import { PhoneNumberVerification } from "./dto/phonenumber-verification.dto";

@Controller("auth")
export class AuthController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    @Post("signUpClient")
    async signUpClient(
        @Body() createUser: any
    ) {
        return this.usersService.createClientUser(createUser)
    }

    @Post("signUpVendor")
    async signUpVendor(
        @Body() createUser: CreateUserVendor
    ){
        return this.usersService.createVendorUser(createUser)
    }

    @Post("signUpAdmin")
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "Users"))
    async signUpAdmin(
        @Body() createUser: CreateUserClientDto
    ) {
        return this.usersService.createAdminUser(createUser)
    }

    @Post("login")
    async login(
        @Body() loginCredentials: LoginCredentialsDto
    ) {
        return this.authService.login(loginCredentials)
    }

    @Post("/verify-email-account")
    async emailVerification(
        @Body() emailVerificationDto: EmailVerificationDto
    ) {
        return this.authService.emailVerification(emailVerificationDto)
    }

    // For now just for testing
    @Post("/resend-account-verification")
    async resendAccountVerification(
        @Body() emailVerificationDto: ResendEmailVerification
    ) {
        return this.authService.resendAccountVerification(emailVerificationDto)
    }

    @Post("resend-phonenumber-verification")
    async sendPhoneNumberVerification(
        @Body() phonenumberVerificationDto: PhoneNumberVerification
    ) {
        return this.authService.sendPhoneNumberVerification(phonenumberVerificationDto)
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