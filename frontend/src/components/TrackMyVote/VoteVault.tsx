import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface VoteVaultProps {
  userHash: string;
  visible: boolean;
}


export default function VoteVault({ userHash, visible }: VoteVaultProps) {
  // Generate 63 fake hashes + 1 user hash = 64 total
  // Using a seed from userHash to keep it pure and stable during render
  const allHashes = useMemo(() => {
    // A simple deterministic hash function for generating fake hashes from userHash
    const getSeededHash = (index: number) => {
      let h = 0;
      const seed = userHash + index;
      for (let i = 0; i < seed.length; i++) {
        h = ((h << 5) - h) + seed.charCodeAt(i);
        h |= 0;
      }
      return Math.abs(h).toString(16).padStart(16, '0').substring(0, 16);
    };

    const fakes = Array.from({ length: 63 }, (_, i) => ({
      hash: getSeededHash(i),
      isUser: false,
      id: i,
    }));
    
    // Use part of the hash to determine the user slot (deterministic)
    const userSlot = parseInt(userHash.substring(0, 8), 16) % 64;
    
    fakes.splice(userSlot, 0, {
      hash: userHash.substring(0, 16),
      isUser: true,
      id: 999,
    });
    return fakes.slice(0, 64);
  }, [userHash]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Vault Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
            <span>💎</span> The Transparent Vault
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">847,293 votes secured · All encrypted</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold">
          🔒 Integrity: 100%
        </div>
      </div>

      {/* Vault grid */}
      <div
        className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-4 overflow-hidden"
        style={{
          backdropFilter: 'blur(12px)',
          boxShadow: 'inset 0 0 60px rgba(34,197,94,0.05)',
        }}
      >
        {/* Animated scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-green-400/30 pointer-events-none z-10"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        <div className="grid grid-cols-8 gap-1.5">
          {allHashes.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.015, duration: 0.3 }}
              className={`relative rounded-md px-1 py-1.5 font-mono text-[9px] truncate text-center cursor-default
                ${item.isUser
                  ? 'bg-amber-100 border border-amber-300 text-amber-700 font-bold'
                  : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors'
                }`}
              title={item.isUser ? `Your vote: ${userHash}` : item.hash}
            >
              {item.hash}
              {item.isUser && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full text-[6px] flex items-center justify-center text-black font-black"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ★
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
            <span className="text-slate-500 text-xs">Your Vote</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-white border border-slate-200" />
            <span className="text-slate-500 text-xs">Other Votes (all anonymous)</span>
          </div>
        </div>
      </div>

      {/* Verification receipt */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-green-700 font-bold text-sm">Vote Verified Successfully</p>
            <p className="text-slate-600 text-xs mt-1">
              Your vote has been counted, anonymized, and securely stored. It cannot be altered or traced back to you.
            </p>
            <div className="mt-2 font-mono text-xs text-green-700/80">
              Receipt: <span className="text-green-600">{userHash.substring(0, 20)}...</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
