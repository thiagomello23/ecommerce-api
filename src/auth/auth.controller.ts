import { Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { CreateUserClientDto } from "src/users/dto/create-user-client.dto";
import { UsersService } from "src/users/users.service";
import { LoginCredentialsDto } from "./dto/login-credentials.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PoliciesGuard } from "./policies.guard";
import { CheckPolicies } from "./decorators/check-policies.decorator";
import { Action } from "src/casl/enums/casl-action";
import { EmailVerificationDto } from "./dto/email-verification.dto";
import { ResendEmailVerification } from "./dto/resend-email-verification.dto";
import { CreateUserVendor } from "src/users/dto/create-user-vendor.dto";
import { SendPhoneNumberVerification } from "./dto/send-phonenumber-verification.dto";
import { PhoneNumberVerification } from "./dto/phonenumber-verification.dto";
import { ValidateUserVendorDto } from "./dto/validate-user-vendor.dto";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "./decorators/is-public.decorator";
import { EmailRecuperationAccount } from "./dto/email-recuperation-account.dto";
import { ResetPassword } from "./dto/reset-password.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    @Post("signUpClient")
    @Public()
    @ApiBody({type: CreateUserClientDto})
    @ApiResponse({status: 400, description: "User email or phone number already beeing used;"})
    async signUpClient(
        @Body() createUser: CreateUserClientDto
    ) {
        return this.usersService.createClientUser(createUser)
    }

    @Post("signUpVendor")
    @Public()
    @ApiBody({type: CreateUserVendor})
    @ApiResponse({
        status: 400, 
        description: `
            User email or phone number already beeing used; 
            Vendor registration number or business name was already been used!
        `}
    )
    @ApiResponse({status: 401, description: "Vendor registration number or business name was already been used!"})
    async signUpVendor(
        @Body() createUser: CreateUserVendor
    ){
        return this.usersService.createVendorUser(createUser)
    }

    @Post("signUpAdmin")
    @CheckPolicies({
        action: Action.Create,
        subject: "Users"
    })
    @ApiBearerAuth()
    @ApiBody({type: CreateUserClientDto})
    @ApiResponse({status: 400, description: "User email or phone number already beeing used;"})
    async signUpAdmin(
        @Body() createUser: CreateUserClientDto
    ) {
        return this.usersService.createAdminUser(createUser)
    }

    @Post("login")
    @Public()
    @ApiBody({type: LoginCredentialsDto})
    @ApiResponse({status: 401, description: "Email, invalid password or email not been verified"})
    async login(
        @Body() loginCredentials: LoginCredentialsDto
    ) {
        return this.authService.login(loginCredentials)
    }

    @Post("/verify-email-account")
    @Public()
    @ApiBody({type: EmailVerificationDto})
    @ApiResponse({status: 404, description: "User email or verification code invalid!"})
    @ApiResponse({status: 400, description: "User has already been verified!"})
    async emailVerification(
        @Body() emailVerificationDto: EmailVerificationDto
    ) {
        return this.authService.emailVerification(emailVerificationDto)
    }

    @Post("/resend-account-verification")
    @Public()
    @ApiBody({type: ResendEmailVerification})
    @ApiResponse({status: 400, description: "Invalid user email for resending verification code!"})
    async resendAccountVerification(
        @Body() emailVerificationDto: ResendEmailVerification
    ) {
        return this.authService.resendAccountVerification(emailVerificationDto)
    }

    @Post("/verify-phonenumber-account")
    @Public()
    @ApiBody({type: PhoneNumberVerification})
    @ApiResponse({status: 404, description: "Invalid phone number or verification code!"})
    @ApiResponse({status: 400, description: "User phone number has already been verified!"})
    async phoneNumberVerification(
        @Body() phoneNumberVerification: PhoneNumberVerification
    ){
        return this.authService.phoneNumberVerification(phoneNumberVerification)
    }

    @Post("send-resend-phonenumber-verification")
    @Public()
    @ApiBody({type: SendPhoneNumberVerification})
    @ApiResponse({status: 404, description: "User phone number not found!"})
    async sendOrResendPhoneNumberVerification(
        @Body() sendPhoneNumberVerification: SendPhoneNumberVerification
    ) {
        return this.authService.sendOrResendPhoneNumberVerification(sendPhoneNumberVerification)
    }

    @Post("/forgot-password")
    @Public()
    @ApiBody({type: EmailRecuperationAccount})
    @ApiResponse({status: 401, description: "User not found!"})
    async forgotPassword(
        @Body() emailRecuperation: EmailRecuperationAccount
    ) {
        return this.authService.forgotPassword(emailRecuperation)
    }

    @Post("/reset-password")
    @CheckPolicies({
        action: Action.Update,
        subject: "Users"
    })
    @ApiBearerAuth()
    @ApiBody({type: ResetPassword})
    @ApiResponse({status: 401, description: "Invalid JWT Token or payload!"})
    async resetPassword(
        @Body() resetPasswordDto: ResetPassword,
        @Req() request
    ) {
        return this.authService.resetPassword(resetPasswordDto, request.user)
    }

    // This transforms a normal vendor user into a valid vendor user with the attribute "validVendor"
    // And this action will only be allowed by admin users
    @Post("/validate-user-vendor")
    @CheckPolicies({
        action: Action.Update,
        subject: "Validate"
    })
    @ApiBearerAuth()
    @ApiBody({type: ValidateUserVendorDto})
    @ApiResponse({status: 404, description: "Invalid user id!"})
    @ApiResponse({status: 401, description: "Vendor user must have a verified email and phone number before get a valid account!"})
    async validateUserVendor(
        @Body() validateUserVendorDto: ValidateUserVendorDto
    ) {
        return this.authService.validateUserVendor(validateUserVendorDto)
    }

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    @CheckPolicies({
        action: Action.Read,
        subject: "Validate"
    })
    @ApiBearerAuth()
    @Get("validate")
    @ApiResponse({status: 401, description: "Invalid JWT Token or payload!"})
    async validateUser(
        @Req() request
    ) {
        return request.user
    }
}