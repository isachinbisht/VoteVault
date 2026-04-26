import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Election } from "../entity/Election";
import { Candidate } from "../entity/Candidate";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const elections = await AppDataSource.manager.find(Election);
        res.json(elections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch elections" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const election = await AppDataSource.manager.findOneBy(Election, { id: req.params.id });
        
        if (!election) {
            return res.status(404).json({ error: "Election not found" });
        }
        res.json(election);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch election" });
    }
});

router.get("/:id/candidates", async (req, res) => {
    try {
        const candidates = await AppDataSource.manager.find(Candidate, {
            where: { election: { id: req.params.id } }
        });
        res.json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
});

export default router;
