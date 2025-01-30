import { IsNotEmpty, IsPhoneNumber, Length } from "class-validator";

export class PhoneNumberVerification {
    // @IsPhoneNumber()
    phoneNumber: string;

    @Length(6)
    verificationCode: string;
}