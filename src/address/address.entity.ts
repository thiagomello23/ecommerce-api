import { Expose } from "class-transformer";
import { BaseEntity } from "src/database/base-entity.entity";
import { Users } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @Expose()
    city: string;

    @Column()
    @Expose()
    state: string;

    @Column()
    @Expose()
    country: string;

    @Column({
        nullable: true
    })
    @Expose()
    district: string; // Or neighborhood

    @Column()
    @Expose()
    street: string;

    @Column()
    @Expose()
    houseNumber: string;

    @Column({
        nullable: true
    })
    @Expose()
    locationReference: string;

    @Column()
    @Expose()
    postalCode: string;

    @ManyToOne(() => Users, (users) => users.address)
    user: Users
}