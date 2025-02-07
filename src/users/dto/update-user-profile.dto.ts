import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserProfile {

    @IsString()
    @IsOptional()
    @ApiProperty()
    firstName: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    lastName: string;

    @IsOptional()
    @ApiProperty()
    file: Express.Multer.File
}