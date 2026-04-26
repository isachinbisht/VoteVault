# VoteVault 🗳️

VoteVault is a comprehensive web platform designed to transform election participation through interactive education, transparency, and confidence-building simulations.

## Project Structure

- **Frontend**: A modern React application built with Vite, Tailwind CSS, and Framer Motion. It includes 3D simulations using Three.js.
- **Backend**: An Express.js server with TypeScript, TypeORM, and SQLite, providing APIs for elections, policies, and voting simulations.

## Key Modules

1. **Policy Translator**: Personalized dashboard to compare candidate policies and understand their impact on key issues.
2. **The Booth**: An interactive 3D voting simulator that guides users through the entire voting process (ID check, EVM interaction).
3. **Track My Vote**: A "Integrity Tunnel" visualization showing how votes are anonymized and securely stored in a cryptographic vault.
4. **Misinformation Lab**: A media literacy game designed to help users identify and debunk fake news and propaganda.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example (if available)
   npm run seed # Populate initial election and candidate data
   npm run dev
   ```
3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Development

- **Backend Port**: `http://localhost:3001`
- **Frontend Port**: `http://localhost:5173`

## Features

- **3D Simulations**: Real-time camera animations and interactive models.
- **Secure Receipts**: Cryptographic receipt hashes for vote verification.
- **Certificate System**: Automated generation of completion certificates with download capability.
- **Responsive Design**: Premium light-themed UI optimized for all devices.

## License

This project is for educational purposes.
