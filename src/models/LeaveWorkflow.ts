import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SubOrganization } from './SubOrganization';

@Entity('leave_workflows')
export class LeaveWorkflow {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'sub_organization_id' })
    subOrganizationId: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => SubOrganization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
