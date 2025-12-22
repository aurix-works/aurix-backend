import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { LeaveType } from './LeaveType';
import { LeaveWorkflow } from './LeaveWorkflow';
import { SubOrganization } from './SubOrganization';

export enum LeaveRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

@Entity('leave_requests')
export class LeaveRequest {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'sub_organization_id' })
    subOrganizationId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'leave_type_id' })
    leaveTypeId: number;

    @Column({ name: 'leave_workflow_id' })
    leaveWorkflowId: number;

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date' })
    endDate: Date;

    @Column({ type: 'text', nullable: true })
    reason: string;

    @Column({
        name: 'current_status',
        type: 'enum',
        enum: LeaveRequestStatus,
        default: LeaveRequestStatus.PENDING,
    })
    currentStatus: LeaveRequestStatus;

    @Column({ name: 'current_step', default: 1 })
    currentStep: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => SubOrganization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => LeaveType, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leave_type_id' })
    leaveType: LeaveType;

    @ManyToOne(() => LeaveWorkflow, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leave_workflow_id' })
    leaveWorkflow: LeaveWorkflow;
}
