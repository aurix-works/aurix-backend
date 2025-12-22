import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { LeaveRequest } from './LeaveRequest';
import { User } from './User';

export enum ApprovalStatus {
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity('leave_approval_logs')
export class LeaveApprovalLog {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'leave_request_id' })
    leaveRequestId: number;

    @Column({ name: 'approver_user_id' })
    approverUserId: number;

    @Column({ type: 'enum', enum: ApprovalStatus })
    status: ApprovalStatus;

    @Column({ type: 'text', nullable: true })
    comments: string;

    @CreateDateColumn({ name: 'action_date' })
    actionDate: Date;

    @ManyToOne(() => LeaveRequest, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leave_request_id' })
    leaveRequest: LeaveRequest;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'approver_user_id' })
    approverUser: User;
}
