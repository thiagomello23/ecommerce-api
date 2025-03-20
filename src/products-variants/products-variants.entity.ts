import { Expose } from "class-transformer";
import { BaseEntity } from "src/database/base-entity.entity";
import { ProductsFiles } from "src/products-files/products-files.entity";
import { Products } from "src/products/products.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class ProductsVariants extends BaseEntity {

    @Column({
        nullable: true
    })
    @Expose()
    // This will only be shown for vendors to identify their variants
    // By default the creation of a new product will use the same product name for the variant name
    // And the first variant created with the product will be the default variant
    variantName: string;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    @Expose()
    price: number;

    @Column({
        type: "integer"
    })
    @Expose()
    stock: number;

    @Column({
        nullable: true
    }) // Hexadecimal colors
    @Expose()
    color: string;

    @Column({
        default: true
    })
    isActive: boolean;

    @Column({
        default: false
    })
    defaultVariant: boolean;

    @ManyToOne(() => Products, (products) => products.productsVariants)
    product: Products;

    @OneToMany(() => ProductsFiles, (productsFiles) => productsFiles.productVariants)
    productsFiles: ProductsFiles[];
}