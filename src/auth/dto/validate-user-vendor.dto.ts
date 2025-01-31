import { IsNotEmpty, IsString } from "class-validator";

export class ValidateUserVendorDto {
    @IsString()
    @IsNotEmpty()
    userId: string;
}