import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Department } from './Department';
import { User } from './User';

@Entity('department_head_history')
export class DepartmentHeadHistory {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'department_id' })
    departmentId: number;

    @Column({ name: 'head_user_id' })
    headUserId: number;

    @Column({ name: 'start_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'timestamp', nullable: true })
    endDate: Date;

    @Column({ name: 'is_current', default: true })
    isCurrent: boolean;

    @ManyToOne(() => Department, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'head_user_id' })
    headUser: User;
}
