import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ValidateUserVendorDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string;
}