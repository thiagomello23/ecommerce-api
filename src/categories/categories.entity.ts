import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/database/base-entity.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Categories extends BaseEntity {
    @ApiProperty()
    @Column({
        unique: true
    })
    name: string;
}