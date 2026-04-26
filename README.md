# VoteVault 🗳️ — Your Interactive Democracy Companion

VoteVault is a comprehensive web platform designed to transform election participation through interactive education, transparency, and confidence-building simulations. Built for the **Civic Engagement & Democratic Education** vertical, it acts as a smart assistant for voters to navigate the complexities of elections.

## 🌟 Vertical & Persona
**Vertical:** Civic Engagement & Democratic Education
**Persona:** The Informed Voter Assistant — A neutral, data-driven companion that simplifies complex policy documents and prepares first-time or anxious voters for the polling booth.

## 🧠 Approach & Logic

### 1. Personalized Policy Translation (AI-Powered)
Instead of reading 100-page manifestos, users provide their top concerns (e.g., Healthcare, Education). Our logic uses **Google Gemini 1.5 Pro** to:
- **Extract:** Parse raw manifesto text to identify core promises.
- **Map:** Link specific policies to user-selected issues.
- **Score:** Provide an impact score based on the relevance and depth of the policy.

### 2. The 3D "Dry Run"
To reduce "Booth Anxiety," we built a 3D simulator using **Three.js**. The logic follows a linear state machine:
- **ID Verification:** Validating virtual identity.
- **EVM Interaction:** A realistic 3D model of an Electronic Voting Machine (EVM) to practice the physical action of voting.
- **Receipt Generation:** Visualizing the internal cryptographic process.

### 3. Trust via Transparency (Integrity Tunnel)
We address "EVM Hacking" fears by visualizing the data flow. The logic demonstrates how a vote is transformed into a cryptographic hash and stored in a "Digital Vault," ensuring the user understands the one-way nature of secure voting.

## 🛠️ Google Services Integration

### **Google Gemini 1.5 Pro**
- **Manifesto Analysis:** Automated extraction and categorization of political promises.
- **Neutral Comparison:** Generating unbiased summaries comparing multiple candidates based on user preferences.
- **Dynamic Feedback:** Analyzing user sentiment and providing clarifying information on complex political topics.

## 🚀 How It Works

1.  **Dashboard**: Start by selecting an upcoming election.
2.  **Policy Lab**: Use the "Policy Translator" to see how candidates align with your personal issues (Powered by Gemini).
3.  **Simulation**: Enter "The Booth" to practice voting in a safe, 3D environment.
4.  **Verification**: Follow your vote through the "Integrity Tunnel" to see the security layers in action.
5.  **Completion**: Receive a "Certified Informed Voter" certificate (simulated) for completing the walkthrough.

## 📝 Assumptions & Considerations
- **Data Neutrality**: We assume the manifesto text provided is the official version. The AI is prompted to remain strictly neutral.
- **Privacy**: No real-world PII (Personally Identifiable Information) is stored; the platform uses session-based mock data for the simulation.
- **Accessibility**: Designed with high-contrast elements and smooth transitions to be usable by a wide range of citizens.

## 🏗️ Project Structure

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Three.js (@react-three/fiber).
- **Backend**: Node.js, Express, TypeScript, TypeORM, SQLite.
- **AI Layer**: Google Generative AI SDK (Gemini).

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Gemini API Key (stored in `backend/.env` as `GEMINI_API_KEY`)

### Quick Start
1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm run seed # Seeds the database with elections/candidates
    npm run dev
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---
*Built for the Google Antigravity Challenge — 2026*

