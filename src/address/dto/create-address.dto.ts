import { IsNotEmpty, IsPostalCode, IsString } from "class-validator";

export class CreateAddressDto {
    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    // Just a simple validation for zipcode
    @IsPostalCode()
    postalCode: string;
}