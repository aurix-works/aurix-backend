import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { SystemService } from './SystemService';

@Entity('plans')
export class Plan {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 50, unique: true })
    code: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    priceMonthly: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    priceYearly: number;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(() => SystemService)
    @JoinTable({
        name: 'plan_services',
        joinColumn: { name: 'plan_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
    })
    services: SystemService[];
}
