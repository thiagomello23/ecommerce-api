import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, Length } from "class-validator";

export class PhoneNumberVerification {
    @ApiProperty()
    // @IsPhoneNumber()
    phoneNumber: string;

    @ApiProperty()
    @Length(6)
    verificationCode: string;
}