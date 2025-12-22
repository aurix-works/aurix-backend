import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { LeaveType } from './LeaveType';

@Entity('user_leave_balances')
export class UserLeaveBalance {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'leave_type_id' })
    leaveTypeId: number;

    @Column()
    year: number;

    @Column({ name: 'total_credited', nullable: true })
    totalCredited: number;

    @Column({ default: 0 })
    used: number;

    @Column({ nullable: true })
    balance: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => LeaveType, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leave_type_id' })
    leaveType: LeaveType;
}
