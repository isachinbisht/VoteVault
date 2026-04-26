import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Candidate } from "./Candidate";

@Entity("policies")
export class Policy {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Candidate, { onDelete: "CASCADE" })
    @JoinColumn({ name: "candidate_id" })
    candidate!: Candidate;

    @Column({ type: "varchar", length: 100, nullable: true })
    category!: string;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "text" })
    description!: string;

    @Column({ type: "int", nullable: true })
    impact_score!: number;

    @CreateDateColumn()
    created_at!: Date;
}
