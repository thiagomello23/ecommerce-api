import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";

export class PhoneNumberVerification {
    @IsPhoneNumber()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @Length(6)
    verificationCode: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}