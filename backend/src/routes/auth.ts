import { Router } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserProfile } from "../entity/UserProfile";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

router.post("/register", async (req, res) => {
    try {
        const { email, password, displayName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const profileRepository = AppDataSource.getRepository(UserProfile);

        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User();
        user.email = email;
        user.password_hash = hashedPassword;
        user.display_name = displayName;
        
        await userRepository.save(user);

        const profile = new UserProfile();
        profile.id = uuidv4();
        profile.user = user;
        
        await profileRepository.save(profile);

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRY || "7d") as any });

        res.status(201).json({ token, user: { id: user.id, email: user.email, display_name: user.display_name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRY || "7d") as any });

        res.json({ token, user: { id: user.id, email: user.email, display_name: user.display_name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/verify", async (req, res) => {
     try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: payload.userId });

        if (!user) {
             return res.status(401).json({ error: "Unauthorized" });
        }

        res.json({ user: { id: user.id, email: user.email, display_name: user.display_name } });
     } catch (error) {
         res.status(401).json({ error: "Unauthorized" });
     }
});

export default router;
