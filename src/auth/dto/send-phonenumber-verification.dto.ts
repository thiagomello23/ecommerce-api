import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches } from "class-validator";

export class SendPhoneNumberVerification {
    @ApiProperty()
    @Matches("/^\+?[1-9]\d{1,14}$/")
    phoneNumber: string;
}