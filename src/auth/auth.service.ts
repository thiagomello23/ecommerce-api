import { Injectable, Inject, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import * as bcrypt from "bcrypt"
import { Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { DatabaseRepositoryConstants, microservicesRMQKey } from 'src/constants';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'types';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { generateVerificationCode } from './helper/generate-verification-code.helper';
import { ResendEmailVerification } from './dto/resend-email-verification.dto';
import { ClientProxy } from '@nestjs/microservices';
import { SendPhoneNumberVerification } from './dto/send-phonenumber-verification.dto';
import { PhoneNumberVerification } from './dto/phonenumber-verification.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(DatabaseRepositoryConstants.usersRepository)
        private usersRepository: Repository<Users>,
        private jwtService: JwtService,
        @Inject(microservicesRMQKey.MESSAGE_QUEUE)
        private readonly messageMs: ClientProxy,
    ){}

    async login(loginCredentials: LoginCredentialsDto) {
        // Basic Validation
        const existingUser = await this.usersRepository.findOne({
            where: {
                email: loginCredentials.email
            }
        })

        if(!existingUser) {
            throw new UnauthorizedException("Email or password invalid!")
        }

        const validatePass = await bcrypt.compare(loginCredentials.password, existingUser.password)

        if(!validatePass) {
            throw new UnauthorizedException("Email or password invalid!")
        }

        if(!existingUser.verificatedUserEmail) {
            throw new UnauthorizedException("Email has not been verified!")
        }

        const payload: JwtPayload = {
            sub: existingUser.id,
            email: existingUser.email
        }

        // Generating JWT token
        return {
            access_token: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET
            })
        }
    }

    async emailVerification(
        emailVerificationDto: EmailVerificationDto
    ) {
        const existingUser = await this.usersRepository
            .createQueryBuilder("users")
            .where("users.email = :email", {email: emailVerificationDto.email})
            .andWhere("users.verificationCode = :verificationCode", {verificationCode: emailVerificationDto.verificationCode})
            .getOne()

        if(!existingUser) {
            throw new NotFoundException("User email or verification code invalid!")
        }

        if(existingUser.verificatedUserEmail) {
            throw new BadRequestException("User has already been verified!")
        }

        existingUser.verificatedUserEmail = true;
        existingUser.emailVerificationCode = null;

        return this.usersRepository.save(existingUser)
    }

    async phoneNumberVerification(
        phoneNumberVerification: PhoneNumberVerification
    ) {
        const existingUser = await this.usersRepository
            .createQueryBuilder("users")
            .andWhere("users.phoneNumber = :phoneNumber", {phoneNumber: phoneNumberVerification.phoneNumber})
            .andWhere(
                "users.phoneNumberVerificationCode = :phoneNumberVerificationCode", 
                {phoneNumberVerificationCode: phoneNumberVerification.verificationCode}
            )
            .getOne()
        
        if(!existingUser) {
            throw new NotFoundException("Invalid phone number or verification code!")
        }

        if(existingUser.verificatedPhoneNumber) {
            throw new BadRequestException("User phone number has already been verified!")
        }

        existingUser.phoneNumberVerificationCode = null;
        existingUser.verificatedPhoneNumber = true;

        return this.usersRepository.save(existingUser)
    }

    async sendOrResendPhoneNumberVerification(
        sendPhoneNumberVerification: SendPhoneNumberVerification
    ){

        const existingUser = await this.usersRepository
            .createQueryBuilder("users")
            .where("users.verificatedPhoneNumber = :verificatedPhoneNumber", {verificatedPhoneNumber: false})
            .andWhere("users.phoneNumber = :phoneNumber", {phoneNumber: sendPhoneNumberVerification.phoneNumber})
            .getOne()

        if(!existingUser) {
            throw new NotFoundException("User phone number not found!")
        }

        const generatedVerificationCode = generateVerificationCode()

        existingUser.phoneNumberVerificationCode = generatedVerificationCode;

        await this.usersRepository.save(existingUser)

        return this.messageMs.send(
            microservicesRMQKey.SEND_PHONENUMBER_ACCOUNT_VERIFICATION,
            {
                phoneNumber: sendPhoneNumberVerification.phoneNumber,
                verificationCode: generatedVerificationCode,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName
            }
        )
    }

    async resendAccountVerification(
        emailVerificationDto: ResendEmailVerification
    ) {
        const existingUser = await this.usersRepository
        .createQueryBuilder("users")
        .where("users.email = :email", {email: emailVerificationDto.email})
        .andWhere("users.verificatedUserEmail = :verificatedUserEmail", {verificatedUserEmail: false})
        .getOne()

        if(!existingUser) {
            throw new BadRequestException("Invalid user email for resending verification code!")
        }

        // Regenerate verification code and Resend email with the verification code
        const verificationCode = generateVerificationCode()

        existingUser.emailVerificationCode = verificationCode

        await this.usersRepository.save(existingUser)

        return this.messageMs.send(
            microservicesRMQKey.SEND_EMAIL_ACCOUNT_VERIFICATION, 
            {
                userEmail: existingUser.email,
                verificationCode: verificationCode,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName
            }
        )
    }
}
