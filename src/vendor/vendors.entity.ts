import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BusinessType } from "./enums/business-type.enum";
import { Users } from "src/users/users.entity";

@Entity()
export class Vendors {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        unique: true
    })
    businessName: string;

    @Column({
        type: "enum",
        enum: BusinessType
    })
    businessType: string;

    @Column({
        unique: true
    })
    registrationNumber: string;

    @Column({
        default: false
    })
    validVendor: boolean;

    @OneToOne(() => Users, (user) => user.vendors) // specify inverse side as a second parameter
    @JoinColumn()
    user: Users
}