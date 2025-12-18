import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SubOrganization } from './SubOrganization';
import { User } from './User';

@Entity('departments')
export class Department {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'sub_organization_id' })
    subOrganizationId: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 20, nullable: true })
    code: string;

    @Column({ name: 'current_head_user_id', nullable: true })
    currentHeadUserId: number;

    @ManyToOne(() => SubOrganization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'current_head_user_id' })
    currentHeadUser: User;
}
