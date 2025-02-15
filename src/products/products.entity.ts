import { Expose } from "class-transformer";
import { Categories } from "src/categories/categories.entity";
import { BaseEntity } from "src/database/base-entity.entity";
import { Vendors } from "src/vendor/vendors.entity";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";

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

    @ManyToMany(() => Categories, (categories) => categories.products)
    categories: Categories[]

    @ManyToOne(() => Vendors, (vendors) => vendors.products)
    vendor: Vendors;
}