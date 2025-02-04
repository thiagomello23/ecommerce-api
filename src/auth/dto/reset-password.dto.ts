import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPassword {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}