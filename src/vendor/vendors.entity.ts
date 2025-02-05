import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BusinessType } from "./enums/business-type.enum";
import { Users } from "src/users/users.entity";
import { Expose } from "class-transformer";
import { BaseEntity } from "src/database/base-entity.entity";

@Entity()
export class Vendors extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        unique: true
    })
    @Expose()
    businessName: string;

    @Column({
        type: "enum",
        enum: BusinessType
    })
    @Expose()
    businessType: string;

    @Column({
        unique: true
    })
    @Expose()
    registrationNumber: string;

    @Column({
        default: false
    })
    validVendor: boolean;

    @OneToOne(() => Users, (user) => user.vendors) // specify inverse side as a second parameter
    @JoinColumn()
    user: Users
}