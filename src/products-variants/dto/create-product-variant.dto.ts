import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsHexColor, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength } from "class-validator";

export class CreateProductVariantDto {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    variantName: string;

    @ApiProperty()
    @IsNumber({maxDecimalPlaces: 2})
    price: number;

    @ApiProperty()
    @IsInt()
    @Max(9999)
    stock: number;

    @ApiProperty()
    @IsHexColor()
    color: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    defaultVariant: boolean;

    @ApiProperty()
    @IsUUID()
    productId: string;
}