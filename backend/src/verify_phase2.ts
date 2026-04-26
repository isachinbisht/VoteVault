import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function verify() {
    try {
        console.log("--- Verifying Phase 2 Endpoints ---");

        // 1. Create a user (or just use a mock ID if we don't want to register every time)
        // For testing, we'll try to register a test user
        let userId: string;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                email: `test_${Date.now()}@example.com`,
                password: 'password123',
                displayName: 'Test User'
            });
            userId = regRes.data.user.id;
            console.log("✓ User registered:", userId);
        } catch (e) {
            console.log("! User registration failed (maybe already exists), using a fallback ID");
            userId = "some-uuid-here"; // This will fail later if not in DB
        }

        // 2. Update Profile
        const profileRes = await axios.post(`${API_URL}/users/profile`, {
            userId,
            topIssues: ["Environment", "Economy"],
            politicalLeaning: "Moderate"
        });
        console.log("✓ Profile updated:", profileRes.data.top_issues);

        // 3. Fetch Profile
        const getProfileRes = await axios.get(`${API_URL}/users/profile/${userId}`);
        console.log("✓ Profile fetched:", getProfileRes.data.political_leaning);

        // 4. Compare Candidates
        const compareRes = await axios.post(`${API_URL}/policies/compare`, {
            candidateIds: [
                "9f0d493e-cc0c-4cdc-bc8e-f7d576950950",
                "1f54de65-bbdd-4b2a-bc4b-020e913a4418"
            ],
            userId
        });
        console.log("✓ Comparison Summary:", compareRes.data.comparisonSummary.substring(0, 100) + "...");

        console.log("\n--- Verification Complete ---");
    } catch (error: any) {
        console.error("Verification failed:", error.response?.data || error.message);
    }
}

verify();
