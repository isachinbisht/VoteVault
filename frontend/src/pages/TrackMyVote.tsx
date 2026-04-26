import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import IntegrityTunnel from '../components/TrackMyVote/IntegrityTunnel';
import VoteVault from '../components/TrackMyVote/VoteVault';

// Simple SHA-256-like hash (deterministic, for demo)
function mockHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Generate a longer realistic-looking hash
  const seed = input + 'salt2026';
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h) ^ seed.charCodeAt(i);
    h |= 0;
  }
  return (
    Math.abs(h).toString(16).padStart(8, '0') +
    hex.split('').reverse().join('') +
    Math.abs(hash ^ h).toString(16).padStart(8, '0') +
    'a3f7' +
    Math.abs(h * 31).toString(16).padStart(8, '0')
  ).substring(0, 64);
}

const CANDIDATES = [
  { name: 'Narendra Modi', party: 'BJP', color: '#FF6B00', emoji: '🪷' },
  { name: 'Rahul Gandhi', party: 'INC', color: '#19AADE', emoji: '✋' },
  { name: 'Arvind Kejriwal', party: 'AAP', color: '#00B4D8', emoji: '🧹' },
];

const STEPS_META = [
  {
    title: 'Cast Your Test Vote',
    subtitle: 'Choose a candidate to simulate the voting process',
  },
  {
    title: 'Anonymization in Progress',
    subtitle: 'Your personal information is being stripped from the vote',
  },
  {
    title: 'Cryptographic Encryption',
    subtitle: 'Your vote is being secured with SHA-256 hashing',
  },
  {
    title: 'Vote Stored in Vault',
    subtitle: 'Securely placed in the transparent encrypted vault',
  },
  {
    title: 'Verification Complete',
    subtitle: 'You can now verify your vote using your receipt hash',
  },
];

export default function TrackMyVote() {
  const [selectedCandidate, setSelectedCandidate] = useState<(typeof CANDIDATES)[0] | null>(null);
  const [step, setStep] = useState(-1);
  const [hash, setHash] = useState('');
  const [receiptInput, setReceiptInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<null | 'found' | 'not_found'>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCastVote = () => {
    if (!selectedCandidate) return;
    const voteHash = mockHash(selectedCandidate.name + Date.now());
    setHash(voteHash);
    setStep(0);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (!isAnimating || step < 0 || step >= 3) {
      if (step === 3) {
        const t = setTimeout(() => setIsAnimating(false), 0);
        return () => clearTimeout(t);
      }
      return;
    }
    const timer = setTimeout(() => {
      setStep((s) => s + 1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [step, isAnimating]);

  const handleVerify = () => {
    const trimmed = receiptInput.trim().toLowerCase();
    if (trimmed === hash.substring(0, 20).toLowerCase() || trimmed === hash.toLowerCase()) {
      setVerificationResult('found');
    } else {
      setVerificationResult('not_found');
    }
  };

  const handleReset = () => {
    setStep(-1);
    setSelectedCandidate(null);
    setHash('');
    setReceiptInput('');
    setVerificationResult(null);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-200">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #22c55e 0%, transparent 60%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 60%)',
          }}
        />
        <div className="relative container mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="text-slate-500 hover:text-slate-800 text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center text-2xl">
              🔍
            </div>
            <div>
              <p className="text-green-600 text-xs font-semibold tracking-widest uppercase">Module 3</p>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Track My Vote</h1>
            </div>
          </div>
          <p className="text-slate-600 text-base max-w-xl ml-16">
            Understand how your vote travels from the ballot box to the final count — anonymously,
            securely, and verifiably.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        {/* Step indicator */}
        {step >= 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 text-center"
            >
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                Step {Math.min(step + 1, 4)} of 4
              </p>
              <h2 className="text-xl font-bold text-slate-900">{STEPS_META[step]?.title}</h2>
              <p className="text-slate-500 text-sm mt-1">{STEPS_META[step]?.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        )}

        {/* PHASE: Candidate selection */}
        {step === -1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-2">🗳️ Cast a Test Vote</h2>
              <p className="text-slate-500 text-sm mb-6">
                Select a candidate to begin the simulation. This is completely anonymous.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CANDIDATES.map((c) => (
                  <motion.button
                    key={c.name}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCandidate(c)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedCandidate?.name === c.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                    style={
                      selectedCandidate?.name === c.name
                        ? { boxShadow: `0 0 20px ${c.color}20`, borderColor: c.color }
                        : {}
                    }
                  >
                    {selectedCandidate?.name === c.name && (
                      <div
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                        style={{ background: c.color }}
                      >
                        ✓
                      </div>
                    )}
                    <div className="text-3xl mb-2">{c.emoji}</div>
                    <div className="font-bold text-sm text-slate-900">{c.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{c.party}</div>
                    <div
                      className="mt-2 h-1 rounded-full w-12"
                      style={{ background: c.color }}
                    />
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCastVote}
                disabled={!selectedCandidate}
                className="mt-6 w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
                style={{
                  background: selectedCandidate
                    ? `linear-gradient(135deg, ${selectedCandidate.color}, ${selectedCandidate.color}cc)`
                    : '#e2e8f0',
                  boxShadow: selectedCandidate ? `0 8px 20px ${selectedCandidate.color}30` : 'none',
                }}
              >
                Cast Test Vote →
              </motion.button>
            </div>

            {/* Info card */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-blue-800 text-sm font-semibold mb-2">ℹ️ What happens next?</p>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>✦ Your vote will be anonymized (personal data stripped)</li>
                <li>✦ Encrypted with SHA-256 cryptographic hashing</li>
                <li>✦ Stored in the Transparent Vault alongside millions of others</li>
                <li>✦ You'll receive a receipt hash to verify your vote anytime</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* PHASE: Tunnel steps 0-3 */}
        {step >= 0 && step <= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <IntegrityTunnel
              activeStep={step}
              candidateName={selectedCandidate?.name || ''}
              hash={hash}
            />

            {step === 3 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(4)}
                className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  boxShadow: '0 8px 20px rgba(34,197,94,0.3)',
                }}
              >
                View Your Vote in the Vault →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* PHASE: Vault + Verification */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <VoteVault userHash={hash} visible={true} />

            {/* Verification panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-base mb-1 text-slate-900">🔍 Verify Your Vote</h3>
              <p className="text-slate-500 text-sm mb-4">
                Enter the first 20 characters of your receipt hash to verify your vote exists in the vault.
              </p>
              <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-700 mb-4 break-all border border-slate-200">
                Your receipt: {hash}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={receiptInput}
                  onChange={(e) => {
                    setReceiptInput(e.target.value);
                    setVerificationResult(null);
                  }}
                  placeholder="Paste your receipt hash here..."
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 font-mono"
                />
                <button
                  onClick={handleVerify}
                  className="px-4 py-2.5 rounded-xl bg-green-100 border border-green-200 text-green-700 text-sm font-semibold hover:bg-green-200 transition-colors"
                >
                  Verify
                </button>
              </div>

              <AnimatePresence>
                {verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mt-3 p-3 rounded-xl text-sm font-semibold ${
                      verificationResult === 'found'
                        ? 'bg-green-100 border border-green-200 text-green-700'
                        : 'bg-red-100 border border-red-200 text-red-700'
                    }`}
                  >
                    {verificationResult === 'found'
                      ? '✅ Vote found and verified! Your vote is securely counted.'
                      : '❌ Hash not found. Please paste the correct receipt hash.'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust score */}
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center shadow-sm">
              <p className="text-slate-500 text-sm mb-2">Your Election Trust Score</p>
              <div className="text-5xl font-black text-green-600 mb-1">+35</div>
              <p className="text-green-700 text-sm">Trust points gained from this module</p>
              <div className="mt-4 flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-sm hover:bg-slate-50 transition-colors text-slate-700 font-medium shadow-sm"
                >
                  ↺ Try Again
                </button>
                <Link
                  to="/misinfo"
                  className="px-4 py-2 rounded-xl font-bold text-sm text-white shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}
                >
                  Next: Misinformation Lab →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
