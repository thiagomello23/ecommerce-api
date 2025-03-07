import { Expose } from "class-transformer";
import { Categories } from "src/categories/categories.entity";
import { BaseEntity } from "src/database/base-entity.entity";
import { ProductsFiles } from "src/products-files/products-files.entity";
import { ProductsVariants } from "src/products-variants/products-variants.entity";
import { Vendors } from "src/vendor/vendors.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Products extends BaseEntity {
    @Column()
    @Expose()
    productName: string;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    @Expose()
    price: number;

    @Column()
    @Expose()
    description: string;

    @Column({
        type: "integer"
    })
    @Expose()
    stock: number;

    @Column()
    @Expose()
    isActive: boolean;

    @Column({
        default: false
    })
    isValid: boolean;

    @ManyToMany(() => Categories, (categories) => categories.products)
    categories: Categories[]

    @ManyToOne(() => Vendors, (vendors) => vendors.products)
    vendor: Vendors;

    @OneToMany(() => ProductsFiles, (productsFiles) => productsFiles.product)
    productsFiles: ProductsFiles[]

    @OneToMany(() => ProductsVariants, (productsVariants) => productsVariants.product)
    productsVariants: ProductsVariants[]
}