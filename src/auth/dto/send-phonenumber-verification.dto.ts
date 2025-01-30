import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";

export class SendPhoneNumberVerification {
    // @IsPhoneNumber()
    phoneNumber: string;
}