import { motion } from 'framer-motion';

export default function ConspiracyOverlay() {
  const generateRandomSymbol = () => {
    const symbols = ['Δ', 'Ω', '∞', '⌘', '☤', '⚡', '⚠', '⚛', '☢', '☠'];
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  return (
    <>
      {/* Scanning lines effect */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--terminal-green)]/10 to-transparent"
          style={{ backgroundSize: '100% 3px', backgroundRepeat: 'repeat' }}
          animate={{
            backgroundPosition: ['0 0', '0 100%']
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,187,0.1)_0%,transparent_50%)]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Corner decorations */}
      <div className="fixed inset-0 pointer-events-none z-[2]">
        {/* Top left */}
        <motion.div
          className="absolute top-0 left-0 w-48 h-48 border-l-2 border-t-2 border-[var(--terminal-green)]/30"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1],
            filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {/* Top right */}
        <motion.div
          className="absolute top-0 right-0 w-48 h-48 border-r-2 border-t-2 border-[var(--terminal-green)]/30"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            delay: 1,
          }}
        />
        {/* Bottom left */}
        <motion.div
          className="absolute bottom-0 left-0 w-48 h-48 border-l-2 border-b-2 border-[var(--terminal-green)]/30"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            delay: 2,
          }}
        />
        {/* Bottom right */}
        <motion.div
          className="absolute bottom-0 right-0 w-48 h-48 border-r-2 border-b-2 border-[var(--terminal-green)]/30"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            delay: 3,
          }}
        />
      </div>

      {/* Random binary code effect */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden opacity-30">
        <div className="absolute inset-0 flex flex-wrap gap-6 p-6 font-mono text-sm text-[var(--terminal-green)]">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              {generateRandomSymbol() + ' ' + Array.from({ length: 6 }, () => Math.round(Math.random())).join('')}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Glitch overlay */}
      <div className="fixed inset-0 pointer-events-none z-[2] mix-blend-overlay">
        <motion.div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')]"
          animate={{
            opacity: [0, 0.1, 0],
            x: [-2, 0, 2, 0],
            y: [-2, 2, -2],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: Math.random() * 3 + 1,
          }}
        />
      </div>

      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none z-[2]">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.4)_100%)]"
          animate={{
            opacity: [0.6, 0.8, 0.6],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </>
  );
}