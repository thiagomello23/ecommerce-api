import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class EmailRecuperationAccount {
    @IsEmail()
    @ApiProperty()
    email: string;
}