import { Injectable, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
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
            throw new UnauthorizedException("Email has not being verified!")
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

        if(existingUser.verificatedUserEmail) {
            throw new BadRequestException("User has already being verified!")
        }

        if(!existingUser) {
            throw new UnauthorizedException("User email or verification code invalid!")
        }

        existingUser.verificatedUserEmail = true;
        existingUser.verificationCode = null;

        return this.usersRepository.save(existingUser)
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

        existingUser.verificationCode = verificationCode

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
