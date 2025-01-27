import { Users } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column({
        nullable: true
    })
    district: string; // Or neighborhood

    @Column()
    street: string;

    @Column()
    houseNumber: string;

    @Column({
        nullable: true
    })
    locationReference: string;

    @Column()
    postalCode: string;

    @ManyToOne(() => Users, (users) => users.address)
    user: Users
}