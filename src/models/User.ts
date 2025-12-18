import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, Unique, ManyToMany, JoinTable } from 'typeorm';
import { SubOrganization } from './SubOrganization';
import { Role } from './Role';
import bcrypt from 'bcryptjs';

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    TERMINATED = 'terminated',
}

@Entity('users')
@Unique(['subOrganizationId', 'email'])
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'sub_organization_id' })
    subOrganizationId: number;

    @Column({ name: 'employee_code', length: 50, nullable: true })
    employeeCode: string;

    @Column({ name: 'first_name', length: 100, nullable: true })
    firstName: string;

    @Column({ name: 'last_name', length: 100, nullable: true })
    lastName: string;

    @Column({ length: 255 })
    email: string;

    @Column({ name: 'password_hash', length: 255, select: false })
    password: string;

    @Column({ name: 'current_manager_id', nullable: true })
    currentManagerId: number;

    @Column({ length: 100, nullable: true })
    designation: string;

    @Column({ name: 'joining_date', type: 'date', nullable: true })
    joiningDate: Date;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @ManyToOne(() => SubOrganization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'current_manager_id' })
    currentManager: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2a$')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
