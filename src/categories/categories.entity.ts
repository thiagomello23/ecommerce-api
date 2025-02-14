import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/database/base-entity.entity";
import { Products } from "src/products/products.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity()
export class Categories extends BaseEntity {
    @ApiProperty()
    @Column({
        unique: true
    })
    name: string;

    @ManyToMany(() => Products, (products) => products.categories)
    @JoinTable()
    products: Products[]
}