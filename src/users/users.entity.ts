import { Expose } from "class-transformer";
import { Address } from "src/address/address.entity";
import { Roles } from "src/roles/roles.entity";
import { Vendors } from "src/vendor/vendors.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @Expose()
    firstName: string;

    @Column()
    @Expose()
    lastName: string;

    @Column({
        unique: true
    })
    @Expose()
    email: string;

    @Column({
        unique: true
    })
    @Expose()
    phoneNumber: string;

    @Column()
    password: string;

    // For all accounts email verification is necessary to login
    @Column({default: false})
    verificatedUserEmail: boolean

    // For vendors to be accepted in the platform is necessary to have a
    // Verified phoneNumber in order to be a valid vendor
    @Column({default: false})
    verificatedPhoneNumber: boolean;

    @Column({nullable: true})
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: string;

    @Column({nullable: true})
    emailVerificationCode: string;

    @Column({nullable: true})
    phoneNumberVerificationCode: string;

    @ManyToMany(() => Roles, (roles) => roles.users)
    roles: Roles[];

    @OneToOne(() => Vendors, (vendors) => vendors.user) // specify inverse side as a second parameter
    vendors: Vendors

    @OneToMany(() => Address, (address) => address.user)
    address: Address[]
}