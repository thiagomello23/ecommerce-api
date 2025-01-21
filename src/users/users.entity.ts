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

    @Column({default: false})
    verificatedUserEmail: boolean

    @Column({nullable: true})
    createdAt: string;

    @Column({nullable: true})
    verificationCode: string;

    @ManyToMany(() => Roles, (roles) => roles.users)
    roles: Roles[];
}