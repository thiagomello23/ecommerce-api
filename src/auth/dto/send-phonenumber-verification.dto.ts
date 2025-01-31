import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";

export class SendPhoneNumberVerification {
    @ApiProperty()
    // @IsPhoneNumber()
    phoneNumber: string;
}