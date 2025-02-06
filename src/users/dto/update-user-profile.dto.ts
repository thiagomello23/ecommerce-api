import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserProfile {

    @IsString()
    @IsOptional()
    name: string;

    @IsOptional()
    file: Express.Multer.File
}