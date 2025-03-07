import { Expose } from "class-transformer";
import { BaseEntity } from "src/database/base-entity.entity";
import { ProductsFiles } from "src/products-files/products-files.entity";
import { Products } from "src/products/products.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class ProductsVariants extends BaseEntity {

    @Column()
    @Expose()
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

    @ManyToOne(() => Products, (products) => products.productsVariants)
    product: Products;

    @OneToMany(() => ProductsFiles, (productsFiles) => productsFiles.productVariants)
    productsFiles: ProductsFiles[];
}