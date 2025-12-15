import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from './Organization';

export enum AccountStatus {
    ONBOARDING = 'onboarding',
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    CHURNED = 'churned',
}

@Entity('sub_organizations')
export class SubOrganization {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    organizationId: number;

    @ManyToOne(() => Organization)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255, nullable: true })
    contactEmail: string;

    @Column({ length: 50, nullable: true })
    taxId: string;

    @Column({ type: 'text', nullable: true })
    billingAddress: string;

    @Column({
        type: 'enum',
        enum: AccountStatus,
        default: AccountStatus.ONBOARDING,
    })
    accountStatus: AccountStatus;

    @CreateDateColumn()
    createdAt: Date;
}
