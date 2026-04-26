import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

import { User } from "./entity/User";
import { UserProfile } from "./entity/UserProfile";
import { Election } from "./entity/Election";
import { Candidate } from "./entity/Candidate";
import { Policy } from "./entity/Policy";
import { UserPolicyPreference } from "./entity/UserPolicyPreference";
import { BoothSession } from "./entity/BoothSession";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true, // Auto-create tables for dev. Use migrations in production!
    logging: false,
    entities: [User, UserProfile, Election, Candidate, Policy, UserPolicyPreference, BoothSession],
    migrations: [],
    subscribers: [],
});
