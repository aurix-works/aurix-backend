import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SubOrganization } from './SubOrganization';

@Entity('leave_types')
export class LeaveType {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'sub_organization_id' })
    subOrganizationId: number;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 20, nullable: true })
    code: string;

    @Column({ name: 'is_carry_forward', default: false })
    isCarryForward: boolean;

    @ManyToOne(() => SubOrganization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
