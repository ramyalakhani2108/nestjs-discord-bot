import { RoleMaster } from "src/status_master/entities/role-master.entity";
import { StatusMaster } from "src/status_master/entities/status_master.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('user-requests')
export class UserRequests {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'bigint',
        unique: true,
        nullable: false
    })
    dcUserId: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    dcUsername: string;

    @ManyToOne(() => RoleMaster, { nullable: false })
    forRole: RoleMaster;

    @Column('simple-array')
    skills: string[];

    @Column({
        type: 'float',
        nullable: false,
        default: 0
    })
    availableTime: number;

    @Column({
        type: 'text',
        nullable: false
    })
    expectations: string;

    @ManyToOne(() => StatusMaster, (statusMaster) => statusMaster.userRequests, { nullable: false })
    status: StatusMaster;


}