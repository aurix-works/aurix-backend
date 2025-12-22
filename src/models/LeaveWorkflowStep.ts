import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LeaveWorkflow } from './LeaveWorkflow';
import { Role } from './Role';

@Entity('leave_workflow_steps')
export class LeaveWorkflowStep {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'leave_workflow_id' })
    leaveWorkflowId: number;

    @Column({ name: 'step_order' })
    stepOrder: number;

    @Column({ name: 'approver_role_id', nullable: true })
    approverRoleId: number;

    @ManyToOne(() => LeaveWorkflow, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leave_workflow_id' })
    leaveWorkflow: LeaveWorkflow;

    @ManyToOne(() => Role, { nullable: true })
    @JoinColumn({ name: 'approver_role_id' })
    approverRole: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
