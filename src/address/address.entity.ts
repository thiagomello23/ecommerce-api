import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { BaseEntity } from "src/database/base-entity.entity";
import { Users } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column()
    @Expose()
    city: string;

    @ApiProperty()
    @Column()
    @Expose()
    state: string;

    @ApiProperty()
    @Column()
    @Expose()
    country: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    @Expose()
    district: string; // Or neighborhood

    @ApiProperty()
    @Column()
    @Expose()
    street: string;

    @ApiProperty()
    @Column()
    @Expose()
    houseNumber: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    @Expose()
    locationReference: string;

    @Column({
        default: false
    })
    defaultAddress: boolean;

    @ApiProperty()
    @Column()
    @Expose()
    postalCode: string;
    
    @ManyToOne(() => Users, (users) => users.address)
    user: Users
}