import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface MisinfoScoreboardProps {
  score: number;
  totalCards: number;
  correctCards: number;
  level: number;
  onPlayAgain: () => void;
}

function Confetti() {
  const [pieces] = useState(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ['#FF6B00', '#19AADE', '#22c55e', '#f97316', '#a855f7', '#eab308'][Math.floor(Math.random() * 6)],
    size: 6 + Math.random() * 8,
    randomX: (Math.random() - 0.5) * 100
  })));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-2%',
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{
            top: '105%',
            rotate: [0, 360, 720],
            x: [0, p.randomX],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

export default function MisinfoScoreboard({
  score,
  totalCards,
  correctCards,
  level,
  onPlayAgain,
}: MisinfoScoreboardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const accuracy = Math.round((correctCards / totalCards) * 100);
  const grade =
    accuracy >= 80 ? 'Expert Detector' : accuracy >= 60 ? 'Skilled Analyst' : accuracy >= 40 ? 'Learning Watchdog' : 'Beginner';
  const gradeEmoji =
    accuracy >= 80 ? '🏆' : accuracy >= 60 ? '🥈' : accuracy >= 40 ? '🥉' : '📚';
  const gradeColor =
    accuracy >= 80 ? '#22c55e' : accuracy >= 60 ? '#a3e635' : accuracy >= 40 ? '#f97316' : '#94a3b8';

  useEffect(() => {
    if (accuracy >= 60) {
      const t = setTimeout(() => setShowConfetti(true), 0);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => {
        clearTimeout(t);
        clearTimeout(timer);
      };
    }
  }, [accuracy]);

  return (
    <div className="relative">
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        {/* Main certificate */}
        <div
          className="relative rounded-3xl overflow-hidden border-2 p-8 text-center"
          style={{
            borderColor: gradeColor + '60',
            background: `radial-gradient(ellipse at top, ${gradeColor}15, transparent 60%), rgba(255,255,255,0.9)`,
            boxShadow: `0 0 60px ${gradeColor}20, inset 0 0 60px rgba(255,255,255,0.5)`,
          }}
        >
          {/* Decorative corners */}
          <div
            className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg"
            style={{ borderColor: gradeColor + '60' }}
          />
          <div
            className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg"
            style={{ borderColor: gradeColor + '60' }}
          />
          <div
            className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg"
            style={{ borderColor: gradeColor + '60' }}
          />
          <div
            className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-lg"
            style={{ borderColor: gradeColor + '60' }}
          />

          <p
            className="text-xs font-black tracking-widest uppercase mb-4"
            style={{ color: gradeColor }}
          >
            ✦ Media Literacy Certificate ✦
          </p>

          <motion.div
            className="text-7xl mb-4"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: 2 }}
          >
            {gradeEmoji}
          </motion.div>

          <h2 className="text-3xl font-black text-slate-900 mb-1">{grade}</h2>
          <p className="text-slate-500 text-sm mb-6">Awarded for completing the Misinformation Lab</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Score', value: score, unit: 'pts', color: gradeColor },
              { label: 'Accuracy', value: accuracy, unit: '%', color: '#a855f7' },
              {
                label: 'Level',
                value: level,
                unit: `/${level}`,
                color: '#f97316',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-3"
                style={{ background: stat.color + '10', border: `1px solid ${stat.color}30` }}
              >
                <div
                  className="text-2xl font-black"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                  <span className="text-sm font-normal text-slate-500">{stat.unit}</span>
                </div>
                <p className="text-slate-500 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Card breakdown */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <span className="text-green-700 font-bold">{correctCards} correct</span>
            <span>·</span>
            <span className="text-red-700 font-bold">{totalCards - correctCards} missed</span>
            <span>·</span>
            <span>{totalCards} total cards</span>
          </div>

          {/* Date */}
          <p className="text-slate-400 text-xs mt-4">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Skill breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Skills Demonstrated</h3>
          <div className="space-y-2">
            {[
              { skill: 'Identifying Emotional Manipulation', level: Math.min(100, accuracy + 10) },
              { skill: 'Spotting Unverified Claims', level: Math.min(100, accuracy + 5) },
              { skill: 'Recognizing Propaganda Techniques', level: accuracy },
              { skill: 'Source Verification Awareness', level: Math.max(20, accuracy - 10) },
            ].map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{item.skill}</span>
                  <span>{item.level}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: gradeColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.level}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
          >
            ↺ Play Again
          </button>
          <Link
            to="/"
            className="flex-1 py-3 rounded-xl font-bold text-sm text-center text-white shadow-md"
            style={{
              background: `linear-gradient(135deg, ${gradeColor}, ${gradeColor}88)`,
              boxShadow: `0 8px 30px ${gradeColor}30`,
            }}
          >
            🏠 Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
