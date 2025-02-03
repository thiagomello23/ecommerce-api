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
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { Public } from "./decorators/is-public.decorator";

@Controller("auth")
export class AuthController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    @Post("signUpClient")
    @Public()
    @ApiBody({type: CreateUserClientDto})
    async signUpClient(
        @Body() createUser: CreateUserClientDto
    ) {
        return this.usersService.createClientUser(createUser)
    }

    @Post("signUpVendor")
    @Public()
    @ApiBody({type: CreateUserVendor})
    async signUpVendor(
        @Body() createUser: CreateUserVendor
    ){
        return this.usersService.createVendorUser(createUser)
    }

    @Post("signUpAdmin")
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "Users"))
    @ApiBearerAuth()
    @ApiBody({type: CreateUserClientDto})
    async signUpAdmin(
        @Body() createUser: CreateUserClientDto
    ) {
        return this.usersService.createAdminUser(createUser)
    }

    @Post("login")
    @Public()
    @ApiBody({type: LoginCredentialsDto})
    async login(
        @Body() loginCredentials: LoginCredentialsDto
    ) {
        return this.authService.login(loginCredentials)
    }

    @Post("/verify-email-account")
    @Public()
    @ApiBody({type: EmailVerificationDto})
    async emailVerification(
        @Body() emailVerificationDto: EmailVerificationDto
    ) {
        return this.authService.emailVerification(emailVerificationDto)
    }

    @Post("/resend-account-verification")
    @Public()
    @ApiBody({type: ResendEmailVerification})
    async resendAccountVerification(
        @Body() emailVerificationDto: ResendEmailVerification
    ) {
        return this.authService.resendAccountVerification(emailVerificationDto)
    }

    @Post("/verify-phonenumber-account")
    @Public()
    @ApiBody({type: PhoneNumberVerification})
    async phoneNumberVerification(
        @Body() phoneNumberVerification: PhoneNumberVerification
    ){
        return this.authService.phoneNumberVerification(phoneNumberVerification)
    }

    @Post("send-resend-phonenumber-verification")
    @Public()
    @ApiBody({type: SendPhoneNumberVerification})
    async sendOrResendPhoneNumberVerification(
        @Body() sendPhoneNumberVerification: SendPhoneNumberVerification
    ) {
        return this.authService.sendOrResendPhoneNumberVerification(sendPhoneNumberVerification)
    }

    // This transforms a normal vendor user into a valid vendor user with the attribute "validVendor"
    // And this action will only be allowed by admin users
    @Post("/validate-user-vendor")
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "Validate"))
    @ApiBearerAuth()
    @ApiBody({type: ValidateUserVendorDto})
    async validateUserVendor(
        @Body() validateUserVendorDto: ValidateUserVendorDto
    ) {
        return this.authService.validateUserVendor(validateUserVendorDto)
    }

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "Validate"))
    @ApiBearerAuth()
    @Get("validate")
    async validateUser(
        @Req() request
    ) {
        return request.user
    }
}