import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { SubOrganization } from './SubOrganization';
import { LeaveType } from './LeaveType';
import { Role } from './Role';

@Entity('leave_policy_rules')
@Unique(['subOrganizationId', 'leaveTypeId', 'roleId'])
export class LeavePolicyRule {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'sub_organization_id' })
    subOrganizationId: number;

    @Column({ name: 'leave_type_id' })
    leaveTypeId: number;

    @Column({ name: 'role_id' })
    roleId: number;

    @Column({ name: 'days_allowed' })
    daysAllowed: number;

    @ManyToOne(() => SubOrganization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @ManyToOne(() => LeaveType, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'leave_type_id' })
    leaveType: LeaveType;

    @ManyToOne(() => Role, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;
}
