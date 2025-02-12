import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

interface StatInfoPopupProps {
  stat: string;
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

const statDescriptions: Record<string, {
  description: string;
  effects: string[];
  tips: string[];
}> = {
  hacking: {
    description: "Your ability to breach and manipulate quantum systems",
    effects: [
      "Increases success rate of system breaches",
      "Unlocks advanced hacking tools",
      "Reduces detection chance during infiltration"
    ],
    tips: [
      "Use quantum tools to boost hacking attempts",
      "Practice on lower security systems first",
      "Watch for system vulnerabilities"
    ]
  },
  encryption: {
    description: "Your proficiency with quantum encryption protocols",
    effects: [
      "Improves data protection strength",
      "Enables breaking complex encryption",
      "Enhances secure communication"
    ],
    tips: [
      "Study quantum cryptography patterns",
      "Collect encryption keys",
      "Upgrade your quantum decoder"
    ]
  },
  analysis: {
    description: "Your skill at analyzing quantum patterns and data",
    effects: [
      "Better pattern recognition",
      "Increased information gathering",
      "Enhanced system understanding"
    ],
    tips: [
      "Scan systems before hacking",
      "Look for hidden quantum signatures",
      "Document unusual patterns"
    ]
  },
  quantum: {
    description: "Your mastery over quantum mechanics and reality manipulation",
    effects: [
      "Access to quantum abilities",
      "Reality manipulation power",
      "Timeline perception"
    ],
    tips: [
      "Meditate to enhance quantum awareness",
      "Practice timeline viewing",
      "Study quantum anomalies"
    ]
  }
};

export default function StatInfoPopup({ stat, level, isOpen, onClose }: StatInfoPopupProps) {
  const info = statDescriptions[stat];
  if (!info) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md glass-panel rounded-lg p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[var(--terminal-cyan)]" />
                <h3 className="text-lg font-bold text-[var(--terminal-cyan)]">
                  {stat.toUpperCase()} - Level {level}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-[var(--terminal-cyan)]/70 mb-1">
                  DESCRIPTION
                </div>
                <p className="text-sm text-[var(--terminal-cyan)]">
                  {info.description}
                </p>
              </div>

              <div>
                <div className="text-sm text-[var(--terminal-cyan)]/70 mb-1">
                  EFFECTS
                </div>
                <ul className="space-y-1">
                  {info.effects.map((effect, index) => (
                    <li key={index} className="text-sm text-[var(--terminal-cyan)] flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[var(--terminal-cyan)]" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-sm text-[var(--terminal-cyan)]/70 mb-1">
                  TIPS
                </div>
                <ul className="space-y-1">
                  {info.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-[var(--terminal-cyan)] flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[var(--terminal-cyan)]" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Level progress */}
            <div className="mt-4 pt-4 border-t border-[var(--terminal-cyan)]/20">
              <div className="text-sm text-[var(--terminal-cyan)]/70 mb-2">
                PROGRESS TO NEXT LEVEL
              </div>
              <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--terminal-cyan)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(level % 5) * 20}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-[var(--terminal-cyan)]/50 text-right">
                {(level % 5) * 20}% to level {level + 1}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}