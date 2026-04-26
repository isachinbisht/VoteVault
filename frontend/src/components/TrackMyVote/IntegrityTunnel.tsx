import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: number;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

const STEPS: Step[] = [
  {
    id: 0,
    label: 'Vote Cast',
    icon: '🗳️',
    color: '#ef4444',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    description: 'Your vote is submitted to the system',
  },
  {
    id: 1,
    label: 'Anonymized',
    icon: '🎭',
    color: '#f97316',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/50',
    description: 'Your name, DOB & signature are stripped',
  },
  {
    id: 2,
    label: 'Encrypted',
    icon: '🔐',
    color: '#eab308',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    description: 'Vote is cryptographically hashed',
  },
  {
    id: 3,
    label: 'Stored',
    icon: '💎',
    color: '#22c55e',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    description: 'Placed in the transparent encrypted vault',
  },
];

interface IntegrityTunnelProps {
  activeStep: number;
  candidateName: string;
  hash: string;
}

export default function IntegrityTunnel({ activeStep, candidateName, hash }: IntegrityTunnelProps) {
  return (
    <div className="relative w-full">
      {/* Pipeline Track */}
      <div className="relative flex items-center justify-between px-4 mb-8">
        {/* Connecting lines */}
        <div className="absolute inset-0 flex items-center px-16">
          <div className="w-full h-1 bg-slate-200 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${(Math.min(activeStep, 3) / 3) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Step nodes */}
        {STEPS.map((step, i) => (
          <div key={step.id} className="relative flex flex-col items-center z-10">
            <motion.div
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl
                ${i <= activeStep ? step.bgColor + ' ' + step.borderColor : 'bg-slate-50 border-slate-200'}`}
              animate={{
                scale: i === activeStep ? [1, 1.12, 1] : 1,
                boxShadow:
                  i <= activeStep
                    ? `0 0 20px ${step.color}40, 0 0 40px ${step.color}20`
                    : 'none',
              }}
              transition={{ duration: 0.6, repeat: i === activeStep ? Infinity : 0, repeatDelay: 1 }}
            >
              <span className={i <= activeStep ? '' : 'grayscale opacity-30'}>{step.icon}</span>
            </motion.div>
            <p
              className={`mt-2 text-xs font-semibold tracking-wide uppercase ${
                i <= activeStep ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>

      {/* Animated vote ball */}
      <div className="relative h-16 mb-6 overflow-hidden">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-2xl"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${STEPS[Math.min(activeStep, 3)].color}, ${STEPS[Math.min(activeStep, 3)].color}88)`,
            boxShadow: `0 0 20px ${STEPS[Math.min(activeStep, 3)].color}80`,
          }}
          animate={{
            left: `${(Math.min(activeStep, 3) / 3) * 85 + 3}%`,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {activeStep === 0 && '🗳️'}
          {activeStep === 1 && '🎭'}
          {activeStep === 2 && '🔐'}
          {activeStep >= 3 && '💎'}
        </motion.div>
      </div>

      {/* Active step detail card */}
      <AnimatePresence mode="wait">
        {activeStep >= 0 && activeStep < STEPS.length && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl border p-5 ${STEPS[activeStep].bgColor} ${STEPS[activeStep].borderColor}`}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{STEPS[activeStep].icon}</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Step {activeStep + 1}: {STEPS[activeStep].label}
                </h3>
                <p className="text-slate-600 text-sm mb-3">{STEPS[activeStep].description}</p>

                {/* Step-specific content */}
                {activeStep === 0 && (
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl font-mono text-sm shadow-sm">
                    <p className="text-slate-500 text-xs mb-1">Vote submitted for:</p>
                    <p className="text-slate-900 font-bold">{candidateName}</p>
                    <p className="text-slate-500 text-xs mt-2">
                      Voter ID: <span className="text-red-500">VTR-7834-IND-2026</span>
                    </p>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl font-mono text-sm space-y-1 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 line-through">Name: Rajesh Kumar</span>
                      <span className="text-green-600 text-xs">✓ Stripped</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 line-through">DOB: 15 Aug 1985</span>
                      <span className="text-green-600 text-xs">✓ Stripped</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 line-through">Voter ID: VTR-7834</span>
                      <span className="text-green-600 text-xs">✓ Stripped</span>
                    </div>
                    <p className="text-orange-500 font-bold mt-2">✓ ANONYMOUS</p>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl font-mono text-sm shadow-sm">
                    <p className="text-slate-500 text-xs mb-1">SHA-256 Hash:</p>
                    <p className="text-yellow-600 text-xs break-all">{hash}</p>
                    <p className="text-green-600 font-bold mt-2 text-xs">✓ CRYPTOGRAPHICALLY SECURE</p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl font-mono text-sm shadow-sm">
                    <p className="text-slate-500 text-xs mb-1">Vault Entry:</p>
                    <p className="text-green-600 text-xs">
                      Position: #<span className="font-bold">847,293</span>
                    </p>
                    <p className="text-green-600 text-xs">Status: Counted & Verified ✓</p>
                    <p className="text-green-600 text-xs mt-1">Integrity: 100% 🔒</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
