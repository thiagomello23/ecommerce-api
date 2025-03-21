import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsHexColor, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { Users } from "src/users/users.entity";

export class UpdateProductVariantDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @IsOptional()
    variantName: string;

    @ApiProperty()
    @IsNumber({maxDecimalPlaces: 2})
    @IsOptional()
    price: number;

    @ApiProperty()
    @IsHexColor()
    @IsOptional()
    color: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    defaultVariant: boolean;

    productVariantId: string;

    user: Users;
}