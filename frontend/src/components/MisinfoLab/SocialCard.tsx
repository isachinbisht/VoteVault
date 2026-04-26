import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export interface MisinfoCard {
  id: number;
  platform: 'facebook' | 'twitter' | 'whatsapp';
  username: string;
  handle: string;
  avatar: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: string;
  comments: string;
  shares: string;
  isMisinfo: boolean;
  redFlags: string[];
  trustScore: number;
  verdict: string;
  explanation: string;
}

interface SocialCardProps {
  card: MisinfoCard;
  onScan: () => void;
  scanned: boolean;
}

const PlatformColors = {
  facebook: { bg: '#1877F2', label: 'Facebook', icon: '🔵' },
  twitter: { bg: '#1DA1F2', label: 'X (Twitter)', icon: '🐦' },
  whatsapp: { bg: '#25D366', label: 'WhatsApp', icon: '💬' },
};

export default function SocialCard({ card, onScan, scanned }: SocialCardProps) {
  const [isScanning, setIsScanning] = useState(false);
  const platform = PlatformColors[card.platform];

  const handleScan = () => {
    if (scanned) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScan();
    }, 1500);
  };

  return (
    <motion.div
      layout
      className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
      style={{ background: 'rgba(255,255,255,0.9)' }}
    >
      {/* Platform header bar */}
      <div
        className="px-4 py-2 flex items-center gap-2 text-slate-900 text-xs font-semibold"
        style={{ background: platform.bg + '11', borderBottom: `1px solid ${platform.bg}30` }}
      >
        <span>{platform.icon}</span>
        <span style={{ color: platform.bg }}>{platform.label}</span>
        <span className="ml-auto text-slate-400">Public Post</span>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Author row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${platform.bg}22`, border: `1.5px solid ${platform.bg}44` }}>
            {card.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-900">{card.username}</span>
              {card.isMisinfo && !scanned && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  {card.handle}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs">{card.timeAgo}</p>
          </div>
          {scanned && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                card.isMisinfo
                  ? 'bg-red-100 border border-red-200 text-red-700'
                  : 'bg-green-100 border border-green-200 text-green-700'
              }`}
            >
              {card.isMisinfo ? '⚠️ FAKE' : '✅ REAL'}
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="relative">
          <p className="text-slate-700 text-sm leading-relaxed mb-3">{card.content}</p>

          {/* Scanning overlay */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{ background: 'rgba(239,68,68,0.08)' }}
              >
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-red-400/60"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 0.8, repeat: 2, ease: 'linear' }}
                />
                <div className="flex items-center justify-center h-full">
                  <div className="text-red-400 text-sm font-mono animate-pulse">
                    🔍 Scanning for red flags...
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Engagement row */}
        <div className="flex items-center gap-4 text-slate-500 text-xs border-t border-slate-200 pt-3 mb-3">
          <span>👍 {card.likes}</span>
          <span>💬 {card.comments}</span>
          <span>↗️ {card.shares}</span>
        </div>

        {/* Scan button */}
        {!scanned && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleScan}
            disabled={isScanning}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            style={{
              background: isScanning
                ? 'rgba(239,68,68,0.1)'
                : 'linear-gradient(135deg, #fef2f2, #fff7ed)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444',
            }}
          >
            {isScanning ? (
              <>
                <span className="animate-spin">⟳</span> Analyzing...
              </>
            ) : (
              <>🔍 Scan for Red Flags</>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
