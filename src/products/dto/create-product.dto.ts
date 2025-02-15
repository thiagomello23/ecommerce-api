import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max } from "class-validator";
import { Categories } from "src/categories/categories.entity";

export class CreateProductDto {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(20, 200)
    productName: string;

    @ApiProperty()
    @IsDecimal()
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

    @IsArray()
    categoriesId: string[];

    // Vendor data will go along with the JWT Token, so there's no need to get here
}