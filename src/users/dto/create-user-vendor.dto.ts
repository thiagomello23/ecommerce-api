import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { CreateVendor } from "src/vendor/dto/create-vendor.dto";

export class CreateUserVendor {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    vendor: CreateVendor
}