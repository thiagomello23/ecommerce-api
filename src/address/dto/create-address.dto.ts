import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsPostalCode, IsString } from "class-validator";

export class CreateAddressDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty()
    @IsString()
    district: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    street: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    houseNumber: string;

    @ApiProperty()
    @IsString()
    locationReference: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    defaultAddress: boolean = false;

    // Just a simple validation for zipcode
    @ApiProperty()
    @IsPostalCode("any")
    postalCode: string;
}