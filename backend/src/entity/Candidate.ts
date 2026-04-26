import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Election } from "./Election";

@Entity("candidates")
export class Candidate {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Election, { onDelete: "CASCADE" })
    @JoinColumn({ name: "election_id" })
    election!: Election;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    party!: string;

    @Column({ type: "text", nullable: true })
    bio!: string;

    @Column({ type: "varchar", length: 7, nullable: true })
    color_hex!: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    manifesto_url!: string;

    @Column({ type: "text", nullable: true })
    manifesto_text!: string;

    @Column({ type: "int", nullable: true })
    seats_won!: number;

    @Column({ type: "float", nullable: true })
    vote_share!: number; // percentage e.g. 37.4

    @Column({ type: "varchar", length: 10, nullable: true })
    symbol_emoji!: string; // Party symbol as emoji

    @Column({ type: "varchar", length: 20, nullable: true })
    alliance!: string; // e.g. NDA, INDIA, UPA

    @CreateDateColumn()
    created_at!: Date;
}
