import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { SubOrganization } from './SubOrganization';

@Entity('user_manager_history')
export class UserManagerHistory {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'sub_organization_id' })
    subOrganizationId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'manager_id' })
    managerId: number;

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    endDate: Date;

    @Column({ name: 'is_current', default: true })
    isCurrent: boolean;

    @ManyToOne(() => SubOrganization)
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'manager_id' })
    manager: User;
}
