import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: 100, unique: true })
    slug: string;

    @Column({ length: 255, nullable: true })
    description: string;
}
