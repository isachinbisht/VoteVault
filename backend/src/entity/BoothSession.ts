import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Election } from "./Election";
import { Candidate } from "./Candidate";

@Entity("booth_sessions")
export class BoothSession {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(() => Election, { onDelete: "CASCADE" })
    @JoinColumn({ name: "election_id" })
    election!: Election;

    @Column({ type: "int", default: 0 })
    session_duration!: number; // in seconds

    @Column({ type: "simple-json", nullable: true })
    steps_completed!: string[]; // e.g., ['id_check', 'evm_interaction', 'submission']

    @ManyToOne(() => Candidate, { nullable: true })
    @JoinColumn({ name: "test_vote_candidate_id" })
    test_vote_candidate!: Candidate;

    @Column({ type: "datetime", nullable: true })
    test_vote_submitted_at!: Date;

    @Column({ type: "int", nullable: true })
    confidence_before!: number; // 0-100

    @Column({ type: "int", nullable: true })
    confidence_after!: number; // 0-100

    @CreateDateColumn()
    created_at!: Date;
}
