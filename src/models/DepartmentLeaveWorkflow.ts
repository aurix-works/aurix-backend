import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Department } from './Department';
import { LeaveType } from './LeaveType';
import { LeaveWorkflow } from './LeaveWorkflow';

@Entity('department_leave_workflows')
export class DepartmentLeaveWorkflow {
    @PrimaryColumn({ name: 'department_id' })
    departmentId: number;

    @PrimaryColumn({ name: 'leave_type_id' })
    leaveTypeId: number;

    @Column({ name: 'leave_workflow_id' })
    leaveWorkflowId: number;

    @ManyToOne(() => Department, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @ManyToOne(() => LeaveType, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leave_type_id' })
    leaveType: LeaveType;

    @ManyToOne(() => LeaveWorkflow, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leave_workflow_id' })
    leaveWorkflow: LeaveWorkflow;
}
