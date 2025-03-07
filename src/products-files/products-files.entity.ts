import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { BaseEntity } from "src/database/base-entity.entity";
import { ProductsVariants } from "src/products-variants/products-variants.entity";
import { Products } from "src/products/products.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class ProductsFiles extends BaseEntity {

    @Column()
    @ApiProperty()
    imageUrl: string;

    @Column()
    @ApiProperty()
    imageIdName: string;

    @Column()
    @ApiProperty()
    imageOriginalName: string;

    @Column()
    @ApiProperty()
    imageMimetype: string;

    @ManyToOne(() => Products, (products) => products.productsFiles)
    product: Products;

    @ManyToOne(() => ProductsVariants, (productsVariants) => productsVariants.productsFiles)
    productVariants: ProductsVariants;
}