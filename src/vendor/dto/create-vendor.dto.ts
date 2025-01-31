import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { BusinessType } from "../enums/business-type.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateVendor {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    businessName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(BusinessType)
    businessType: BusinessType;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    registrationNumber: string;
}