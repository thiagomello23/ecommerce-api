import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
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

    @IsDefined()
    @ValidateNested()
    @IsNotEmptyObject()
    @Type(() => CreateVendor)
    vendor: CreateVendor

    @IsDefined()
    @ValidateNested()
    @IsNotEmptyObject()
    @Type(() => CreateAddressDto)
    address: CreateAddressDto
}