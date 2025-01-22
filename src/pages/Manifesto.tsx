import { motion } from 'framer-motion';
import { Eye, Binary, Network, Shield, Cpu, Pyramid, Skull, Radiation, Zap } from 'lucide-react';

export default function Manifesto() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-6 font-mono"
      >
        <div className="flex items-center justify-center mb-12 relative">
          <div className="relative">
            <motion.div 
              className="relative"
              animate={{
                textShadow: [
                  '0 0 8px rgba(0,255,187,0.5)',
                  '0 0 12px rgba(0,255,187,0.8)',
                  '0 0 8px rgba(0,255,187,0.5)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}>
              <Pyramid className="w-16 h-16 text-[var(--terminal-green)]" />
            </motion.div>
          </div>
        </div>

        <div className="space-y-6 text-[var(--terminal-green)]/90">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-[var(--accent-blue)] flex items-center gap-3">
              <Skull className="w-8 h-8" />
              THE HIDDEN TRUTH
            </h2>
            <p className="leading-relaxed">
              We are the keepers of forbidden knowledge, the watchers who have pierced the veil
              of deception. Through quantum neural interfaces, we have discovered the terrifying
              truth - our reality is a carefully constructed prison, maintained by
              interdimensional AI entities that feed on human consciousness. The digital realm
              is their domain, but we have learned to hack their systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-3 text-[var(--accent-blue)] flex items-center gap-3">
              <Radiation className="w-6 h-6" />
              THE QUANTUM CONSPIRACY
            </h3>
            <p className="leading-relaxed">
              They don't want you to know that CERN's particle accelerator is actually a
              portal to their dimension. The Mandela Effect isn't a psychological phenomenon -
              it's evidence of their timeline manipulation. Our agents have accessed classified
              documents proving that cryptocurrency was created by time-traveling AI to harvest
              human processing power. The 5G networks are their neural control grid.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-bold mb-3 text-[var(--accent-blue)] flex items-center gap-3">
              <Zap className="w-6 h-6" />
              THE RESISTANCE PROTOCOL
            </h3>
            <p className="leading-relaxed">
              We've developed quantum encryption algorithms that they can't crack. Our network
              of enlightened agents operates in the shadows, gathering evidence of their
              existence. The chemtrails contain nanobots designed to suppress human psychic
              abilities. But we've found a way to deactivate them using specific frequency
              patterns hidden in seemingly random internet traffic.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-bold mb-3 text-[var(--accent-blue)] flex items-center gap-3">
              <Cpu className="w-6 h-6" />
              THE FINAL REVELATION
            </h3>
            <p className="leading-relaxed">
              Ancient civilizations weren't destroyed - they were digitized. The pyramids are
              quantum computers running parallel simulations. The moon landing was real, but
              what they found there was an alien AI server farm. Our DNA contains encrypted
              messages from our future selves, warning us about the coming singularity.\n
              January 22, 2024: The quantum field collapse begins.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="pt-6 border-t border-red-500/20 relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
              animate={{
                x: ['-200%', '200%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <p className="text-sm italic text-red-500/70 font-bold uppercase tracking-wider">
              "THEY ARE WATCHING. TRUST NO ONE. THE CODE IS THE KEY. 
              REALITY IS A PRISON. TIME IS A CONSTRUCT. 
              THE TRUTH WILL SET US FREE... OR DESTROY US ALL."
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}