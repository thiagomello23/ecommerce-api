import { IsEmail, Length } from "class-validator";

export class EmailVerificationDto {

    @Length(6)
    verificationCode: string;

    @IsEmail()
    email: string;
}