import { Router } from "express";
import { AppDataSource } from "../data-source";
import { BoothSession } from "../entity/BoothSession";
import { User } from "../entity/User";
import { Election } from "../entity/Election";
import { Candidate } from "../entity/Candidate";

const router = Router();

// Start a new booth session
router.post("/start", async (req, res) => {
    try {
        const { userId, electionId, confidenceBefore } = req.body;

        const sessionRepo = AppDataSource.getRepository(BoothSession);
        const userRepo = AppDataSource.getRepository(User);
        const electionRepo = AppDataSource.getRepository(Election);

        const [user, election] = await Promise.all([
            userRepo.findOneBy({ id: userId }),
            electionRepo.findOneBy({ id: electionId })
        ]);

        if (!user || !election) {
            return res.status(404).json({ error: "User or Election not found" });
        }

        const session = new BoothSession();
        session.user = user;
        session.election = election;
        session.confidence_before = confidenceBefore;
        session.steps_completed = [];

        await sessionRepo.save(session);
        res.status(201).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to start booth session" });
    }
});

// Update booth session progress
router.post("/update/:sessionId", async (req, res) => {
    try {
        const { step, candidateId, confidenceAfter, duration } = req.body;
        const sessionRepo = AppDataSource.getRepository(BoothSession);
        const session = await sessionRepo.findOne({
            where: { id: req.params.sessionId },
            relations: ["user", "election"]
        });

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        if (step && !session.steps_completed.includes(step)) {
            session.steps_completed.push(step);
        }

        if (candidateId) {
            const candidateRepo = AppDataSource.getRepository(Candidate);
            const candidate = await candidateRepo.findOneBy({ id: candidateId });
            if (candidate) {
                session.test_vote_candidate = candidate;
                session.test_vote_submitted_at = new Date();
            }
        }

        if (confidenceAfter !== undefined) {
            session.confidence_after = confidenceAfter;
        }

        if (duration !== undefined) {
            session.session_duration = duration;
        }

        await sessionRepo.save(session);
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update session" });
    }
});

// Get session details (for certificate)
router.get("/:sessionId", async (req, res) => {
    try {
        const sessionRepo = AppDataSource.getRepository(BoothSession);
        const session = await sessionRepo.findOne({
            where: { id: req.params.sessionId },
            relations: ["user", "election", "test_vote_candidate"]
        });

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch session" });
    }
});

export default router;
