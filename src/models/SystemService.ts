import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('system_services')
export class SystemService {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 50, unique: true })
    code: string;

    @Column({ type: 'text', nullable: true })
    description: string;
}
