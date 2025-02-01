import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, Length, Matches } from "class-validator";

export class PhoneNumberVerification {
    @ApiProperty()
    @Matches(/^\+?[1-9]\d{1,14}$/)
    phoneNumber: string;

    @ApiProperty()
    @Length(6)
    verificationCode: string;
}