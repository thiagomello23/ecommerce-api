import { Roles } from "src/roles/roles.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        unique: true
    })
    email: string;

    @Column({
        unique: true
    })
    phoneNumber: string;

    @Column()
    password: string;

    @ManyToMany(() => Roles, (roles) => roles.users)
    roles: Roles[];
}