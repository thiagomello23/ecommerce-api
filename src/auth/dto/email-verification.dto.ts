import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length } from "class-validator";

export class EmailVerificationDto {

    @ApiProperty()
    @Length(6)
    verificationCode: string;

    @ApiProperty()
    @IsEmail()
    email: string;
}