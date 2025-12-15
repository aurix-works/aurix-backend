import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SubOrganization } from './SubOrganization';
import { Plan } from './Plan';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    PAST_DUE = 'past_due',
    CANCELLED = 'cancelled',
    TRIAL = 'trial',
}

@Entity('sub_org_subscriptions')
export class SubOrgSubscription {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    subOrganizationId: number;

    @ManyToOne(() => SubOrganization)
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @Column()
    planId: number;

    @ManyToOne(() => Plan)
    @JoinColumn({ name: 'plan_id' })
    plan: Plan;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    nextBillingDate: Date;

    @Column({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.TRIAL,
    })
    status: SubscriptionStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    finalPrice: number;
}
