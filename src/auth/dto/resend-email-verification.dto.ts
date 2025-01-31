import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ResendEmailVerification {
    @ApiProperty()
    @IsEmail()
    email: string;
}