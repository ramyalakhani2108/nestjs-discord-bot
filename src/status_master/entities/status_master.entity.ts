import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../enums/status.enum";
import { UserRequests } from "src/users/entities/user-request.entity";

@Entity('status_master')
export class StatusMaster {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        type: 'enum',
        enum: Status,
        nullable: false,
        default: Status.ACTIVE
    })
    name: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => UserRequests, (userRequest) => userRequest.status)
    userRequests: UserRequests[];

}