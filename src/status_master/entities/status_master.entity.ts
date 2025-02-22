import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "../enums/status.enum";

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

}