import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Policy } from "../entity/Policy";
import { Candidate } from "../entity/Candidate";
import { UserProfile } from "../entity/UserProfile";
import { analyzeManifesto, compareCandidates } from "../services/geminiService";

const router = Router();

// Get policies for a specific candidate
router.get("/:candidateId", async (req, res) => {
    try {
        const policyRepo = AppDataSource.getRepository(Policy);
        const policies = await policyRepo.find({
            where: { candidate: { id: req.params.candidateId } }
        });
        res.json(policies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch policies" });
    }
});

// Analyze a manifesto
router.post("/analyze", async (req, res) => {
    try {
        const { candidateId, manifestoText, userId } = req.body;

        if (!manifestoText) {
            return res.status(400).json({ error: "Manifesto text is required" });
        }

        // Fetch user's top issues, or use defaults
        let userIssues = ["Economy", "Healthcare", "Education", "Environment", "Defense"];
        if (userId) {
            const profileRepo = AppDataSource.getRepository(UserProfile);
            const profile = await profileRepo.findOne({ where: { user: { id: userId } } });
            if (profile && profile.top_issues && profile.top_issues.length > 0) {
                userIssues = profile.top_issues;
            }
        }

        // Use AI to analyze
        const analyzedPolicies = await analyzeManifesto(manifestoText, userIssues);
        
        // Optionally save to DB if candidateId provided
        if (candidateId) {
            const candidateRepo = AppDataSource.getRepository(Candidate);
            const candidate = await candidateRepo.findOneBy({ id: candidateId });
            
            if (candidate) {
                const policyRepo = AppDataSource.getRepository(Policy);
                for (const p of analyzedPolicies) {
                    const policy = new Policy();
                    policy.candidate = candidate;
                    policy.category = p.category;
                    policy.title = p.title;
                    policy.description = p.description;
                    policy.impact_score = p.impact_score;
                    await policyRepo.save(policy);
                }
            }
        }

        res.json(analyzedPolicies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to analyze manifesto" });
    }
});

// Compare multiple candidates
router.post("/compare", async (req, res) => {
    try {
        const { candidateIds, userId } = req.body;

        if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length < 2) {
            return res.status(400).json({ error: "At least two candidate IDs are required for comparison" });
        }

        const candidateRepo = AppDataSource.getRepository(Candidate);
        const policyRepo = AppDataSource.getRepository(Policy);
        const profileRepo = AppDataSource.getRepository(UserProfile);

        // Fetch user issues
        let userIssues = ["Economy", "Healthcare", "Education", "Environment", "Defense"];
        if (userId) {
            const profile = await profileRepo.findOne({ where: { user: { id: userId } } });
            if (profile && profile.top_issues && profile.top_issues.length > 0) {
                userIssues = profile.top_issues;
            }
        }

        // Fetch candidates and their policies
        const candidatesData = [];
        for (const id of candidateIds) {
            const candidate = await candidateRepo.findOneBy({ id });
            if (candidate) {
                const policies = await policyRepo.find({ where: { candidate: { id } } });
                candidatesData.push({
                    name: candidate.name,
                    party: candidate.party,
                    policies: policies.map(p => ({
                        category: p.category,
                        title: p.title,
                        description: p.description
                    }))
                });
            }
        }

        const comparisonSummary = await compareCandidates(candidatesData, userIssues);

        res.json({ comparisonSummary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to compare candidates" });
    }
});

export default router;
