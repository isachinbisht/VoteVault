import { Router } from "express";
import { AppDataSource } from "../data-source";
import { UserProfile } from "../entity/UserProfile";
import { UserPolicyPreference } from "../entity/UserPolicyPreference";
import { User } from "../entity/User";
import { Candidate } from "../entity/Candidate";
import { Election } from "../entity/Election";

const router = Router();

// Get user profile
router.get("/profile/:userId", async (req, res) => {
    try {
        const profileRepo = AppDataSource.getRepository(UserProfile);
        const profile = await profileRepo.findOne({
            where: { user: { id: req.params.userId } }
        });
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// Update user profile (top issues, political leaning)
router.post("/profile", async (req, res) => {
    try {
        const { userId, politicalLeaning, topIssues, location, birthYear } = req.body;

        const profileRepo = AppDataSource.getRepository(UserProfile);
        let profile = await profileRepo.findOne({
            where: { user: { id: userId } }
        });

        if (!profile) {
            profile = new UserProfile();
            profile.id = userId; // Using user ID as profile ID for simplicity if needed, or uuid
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOneBy({ id: userId });
            if (!user) return res.status(404).json({ error: "User not found" });
            profile.user = user;
        }

        if (politicalLeaning) profile.political_leaning = politicalLeaning;
        if (topIssues) profile.top_issues = topIssues;
        if (location) profile.location = location;
        if (birthYear) profile.birth_year = birthYear;

        await profileRepo.save(profile);
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// Get user policy preferences (bookmarks, ratings)
router.get("/preferences/:userId", async (req, res) => {
    try {
        const prefRepo = AppDataSource.getRepository(UserPolicyPreference);
        const preferences = await prefRepo.find({
            where: { user: { id: req.params.userId } },
            relations: ["candidate", "election"]
        });
        res.json(preferences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch preferences" });
    }
});

// Save user policy preference (bookmark/rate)
router.post("/preferences", async (req, res) => {
    try {
        const { userId, electionId, candidateId, rating, notes, bookmarked } = req.body;

        const prefRepo = AppDataSource.getRepository(UserPolicyPreference);
        let preference = await prefRepo.findOne({
            where: {
                user: { id: userId },
                election: { id: electionId },
                candidate: { id: candidateId }
            }
        });

        if (!preference) {
            preference = new UserPolicyPreference();
            const userRepo = AppDataSource.getRepository(User);
            const electionRepo = AppDataSource.getRepository(Election);
            const candidateRepo = AppDataSource.getRepository(Candidate);

            const [user, election, candidate] = await Promise.all([
                userRepo.findOneBy({ id: userId }),
                electionRepo.findOneBy({ id: electionId }),
                candidateRepo.findOneBy({ id: candidateId })
            ]);

            if (!user || !election || !candidate) {
                return res.status(404).json({ error: "User, Election, or Candidate not found" });
            }

            preference.user = user;
            preference.election = election;
            preference.candidate = candidate;
        }

        if (rating !== undefined) preference.rating = rating;
        if (notes !== undefined) preference.notes = notes;
        if (bookmarked !== undefined) preference.bookmarked = bookmarked;

        await prefRepo.save(preference);
        res.json(preference);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save preference" });
    }
});

export default router;
