import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("user_profiles")
export class UserProfile {
    @PrimaryColumn("uuid")
    id!: string;

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @Column({ type: "varchar", length: 50, nullable: true })
    political_leaning!: string;

    @Column({ type: "simple-json", nullable: true })
    top_issues!: string[];

    @Column({ type: "varchar", length: 255, nullable: true })
    location!: string;

    @Column({ type: "int", nullable: true })
    birth_year!: number;

    @Column({ type: "simple-json", nullable: true })
    preferences!: Record<string, any>;

    @CreateDateColumn()
    created_at!: Date;
}
