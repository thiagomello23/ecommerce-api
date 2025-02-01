import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsString, Matches, ValidateNested } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { CreateVendor } from "src/vendor/dto/create-vendor.dto";

export class CreateUserVendor {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[1-9]\d{1,14}$/)
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsDefined()
    @ValidateNested()
    @IsNotEmptyObject()
    @Type(() => CreateVendor)
    vendor: CreateVendor

    @ApiProperty()
    @IsDefined()
    @ValidateNested()
    @IsNotEmptyObject()
    @Type(() => CreateAddressDto)
    address: CreateAddressDto
}