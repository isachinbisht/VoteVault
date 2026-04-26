import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("elections")
export class Election {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 255 })
    region!: string;

    @Column({ type: "date" })
    election_date!: Date;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ type: "int", nullable: true })
    candidate_count!: number;

    @Column({ type: "int", nullable: true })
    total_seats!: number; // e.g. 543 for Lok Sabha

    @Column({ type: "int", nullable: true })
    year!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    election_type!: string; // 'Lok Sabha' | 'State Assembly'

    @Column({ type: "varchar", length: 255, nullable: true })
    winning_party!: string;

    @Column({ type: "int", nullable: true })
    winning_seats!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    winning_pm!: string; // PM who formed government

    @CreateDateColumn()
    created_at!: Date;
}
