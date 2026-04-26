import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Election } from "./Election";
import { Candidate } from "./Candidate";

@Entity("user_policy_preferences")
export class UserPolicyPreference {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(() => Election, { onDelete: "CASCADE" })
    @JoinColumn({ name: "election_id" })
    election!: Election;

    @ManyToOne(() => Candidate, { onDelete: "CASCADE" })
    @JoinColumn({ name: "candidate_id" })
    candidate!: Candidate;

    @Column({ type: "int", nullable: true })
    rating!: number;

    @Column({ type: "text", nullable: true })
    notes!: string;

    @Column({ type: "boolean", default: false })
    bookmarked!: boolean;

    @CreateDateColumn()
    created_at!: Date;
}
