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
import { EmailVerificationDto } from "./dto/email-verification.dto";
import { ResendEmailVerification } from "./dto/resend-email-verification.dto";
import { CreateUserVendor } from "src/users/dto/create-user-vendor.dto";
import { SendPhoneNumberVerification } from "./dto/send-phonenumber-verification.dto";
import { PhoneNumberVerification } from "./dto/phonenumber-verification.dto";
import { ValidateUserVendorDto } from "./dto/validate-user-vendor.dto";
import { ApiBody } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    @Post("signUpClient")
    @ApiBody({type: CreateUserClientDto})
    async signUpClient(
        @Body() createUser: CreateUserClientDto
    ) {
        return this.usersService.createClientUser(createUser)
    }

    @Post("signUpVendor")
    @ApiBody({type: CreateUserVendor})
    async signUpVendor(
        @Body() createUser: CreateUserVendor
    ){
        return this.usersService.createVendorUser(createUser)
    }

    @Post("signUpAdmin")
    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "Users"))
    @ApiBody({type: CreateUserClientDto})
    async signUpAdmin(
        @Body() createUser: CreateUserClientDto
    ) {
        return this.usersService.createAdminUser(createUser)
    }

    @Post("login")
    @ApiBody({type: LoginCredentialsDto})
    async login(
        @Body() loginCredentials: LoginCredentialsDto
    ) {
        return this.authService.login(loginCredentials)
    }

    @Post("/verify-email-account")
    @ApiBody({type: EmailVerificationDto})
    async emailVerification(
        @Body() emailVerificationDto: EmailVerificationDto
    ) {
        return this.authService.emailVerification(emailVerificationDto)
    }

    // For now just for testing
    @Post("/resend-account-verification")
    @ApiBody({type: ResendEmailVerification})
    async resendAccountVerification(
        @Body() emailVerificationDto: ResendEmailVerification
    ) {
        return this.authService.resendAccountVerification(emailVerificationDto)
    }

    @Post("/verify-phonenumber-account")
    @ApiBody({type: PhoneNumberVerification})
    async phoneNumberVerification(
        @Body() phoneNumberVerification: PhoneNumberVerification
    ){
        return this.authService.phoneNumberVerification(phoneNumberVerification)
    }

    @Post("send-resend-phonenumber-verification")
    @ApiBody({type: SendPhoneNumberVerification})
    async sendOrResendPhoneNumberVerification(
        @Body() sendPhoneNumberVerification: SendPhoneNumberVerification
    ) {
        return this.authService.sendOrResendPhoneNumberVerification(sendPhoneNumberVerification)
    }

    // This transforms a normal vendor user into a valid vendor user with the attribute "validVendor"
    // And this action will only be allowed by admin users
    @Post("/validate-user-vendor")
    @ApiBody({type: ValidateUserVendorDto})
    async validateUserVendor(
        @Body() validateUserVendorDto: ValidateUserVendorDto
    ) {
        return this.authService.validateUserVendor(validateUserVendorDto)
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