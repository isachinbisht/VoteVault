import { motion, AnimatePresence } from 'framer-motion';
import type { MisinfoCard } from './SocialCard';

interface RedFlagOverlayProps {
  card: MisinfoCard;
  visible: boolean;
  userAnsweredMisinfo: boolean | null;
  onJudge: (isMisinfo: boolean) => void;
  onNext: () => void;
  isLastCard: boolean;
}

export default function RedFlagOverlay({
  card,
  visible,
  userAnsweredMisinfo,
  onJudge,
  onNext,
  isLastCard,
}: RedFlagOverlayProps) {
  const isCorrect =
    userAnsweredMisinfo !== null ? userAnsweredMisinfo === card.isMisinfo : null;

  const trustColor =
    card.trustScore < 30
      ? '#ef4444'
      : card.trustScore < 60
      ? '#f97316'
      : card.trustScore < 80
      ? '#eab308'
      : '#22c55e';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Trust Score Meter */}
          <div
            className="rounded-2xl border p-4"
            style={{
              borderColor: trustColor + '50',
              background: trustColor + '10',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">🔬 AI Analysis Complete</h3>
              <div className="text-right">
                <div className="text-2xl font-black" style={{ color: trustColor }}>
                  {card.trustScore}
                  <span className="text-sm font-normal text-slate-500">/100</span>
                </div>
                <p className="text-xs text-slate-500">Trust Score</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{ background: trustColor }}
                initial={{ width: 0 }}
                animate={{ width: `${card.trustScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Verdict banner */}
            <div
              className="rounded-xl px-3 py-2 text-center font-black text-sm tracking-wide"
              style={{ background: trustColor + '20', color: trustColor }}
            >
              {card.verdict}
            </div>
          </div>

          {/* Red Flags list */}
          {card.redFlags.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <h3 className="font-bold text-sm text-red-500 mb-3 flex items-center gap-2">
                🚩 Red Flags Detected ({card.redFlags.length})
              </h3>
              <div className="space-y-2">
                {card.redFlags.map((flag, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">
                      [{i + 1}]
                    </span>
                    <span className="text-slate-700">{flag}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <h3 className="font-bold text-sm text-slate-900 mb-2">📚 Explanation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{card.explanation}</p>
          </div>

          {/* User judgment (if not yet answered) */}
          {userAnsweredMisinfo === null && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <p className="text-slate-900 font-bold text-sm mb-3 text-center">
                Your verdict: Is this post misinformation?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => onJudge(true)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-100 border border-red-200 text-red-700 hover:bg-red-200 transition-colors"
                >
                  ⚠️ FAKE / MISLEADING
                </button>
                <button
                  onClick={() => onJudge(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-green-100 border border-green-200 text-green-700 hover:bg-green-200 transition-colors"
                >
                  ✅ CREDIBLE / REAL
                </button>
              </div>
            </div>
          )}

          {/* Judgment result */}
          {isCorrect !== null && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-2xl border p-4 text-center ${
                isCorrect
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="text-3xl mb-2">{isCorrect ? '🎉' : '😬'}</div>
              <p className={`font-black text-base ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Correct! +10 points' : 'Not quite! +0 points'}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {isCorrect
                  ? 'Great eye for spotting misinformation!'
                  : `This post was ${card.isMisinfo ? 'FAKE' : 'REAL'}.`}
              </p>

              <button
                onClick={onNext}
                className="mt-4 px-6 py-2.5 rounded-xl font-bold text-sm text-white"
                style={{
                  background: isCorrect
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'linear-gradient(135deg, #f97316, #dc2626)',
                  boxShadow: isCorrect
                    ? '0 4px 20px rgba(34,197,94,0.4)'
                    : '0 4px 20px rgba(249,115,22,0.4)',
                }}
              >
                {isLastCard ? 'See Final Score →' : 'Next Card →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
