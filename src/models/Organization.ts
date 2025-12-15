import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('organizations')
export class Organization {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 100, nullable: true })
    domain: string;

    @CreateDateColumn()
    createdAt: Date;
}
