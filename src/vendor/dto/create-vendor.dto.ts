import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { BusinessType } from "../enums/business-type.enum";

export class CreateVendor {

    @IsNotEmpty()
    @IsString()
    businessName: string;

    @IsNotEmpty()
    @IsEnum(BusinessType)
    businessType: BusinessType;

    @IsNotEmpty()
    @IsString()
    registrationNumber: string;
}