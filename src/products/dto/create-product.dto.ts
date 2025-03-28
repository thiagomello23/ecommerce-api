import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDecimal, IsHexColor, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, MaxLength } from "class-validator";
import { Categories } from "src/categories/categories.entity";

export class CreateProductDto {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(10, 200)
    productName: string;

    @ApiProperty()
    @IsNumber({maxDecimalPlaces: 2})
    price: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(20, 400)
    description: string;

    @ApiProperty()
    @IsInt()
    @Max(9999)
    stock: number;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isActive: boolean = true;

    @ApiProperty()
    @IsArray()
    categoriesId: string[];

    @ApiProperty()
    @IsOptional()
    @IsHexColor()
    color: string;

    // Vendor data will go along with the JWT Token, so there's no need to get here
}