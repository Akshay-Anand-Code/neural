import { motion } from 'framer-motion';
import { Eye, Binary, Shield, Scan } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectXLogo = () => {
  const glitchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="relative inline-block"
      initial="hidden"
      animate="visible"
      variants={glitchVariants}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute -inset-4 bg-[radial-gradient(circle,rgba(0,255,255,0.15)_0%,transparent_70%)] blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main text container */}
      <div className="relative flex items-center">
        {/* P with special effects */}
        <motion.div
          className="relative"
          animate={{
            textShadow: [
              "0 0 8px rgba(0,255,255,0.5)",
              "0 0 12px rgba(0,255,255,0.8)",
              "0 0 8px rgba(0,255,255,0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span
            className="inline-block font-bold text-[var(--terminal-green)]"
            animate={{
              x: [0, -2, 2, -1, 0],
              filter: [
                "brightness(1) contrast(1.2)",
                "brightness(1.2) contrast(1.4)",
                "brightness(1) contrast(1.2)"
              ]
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: Math.random() * 5 + 3
            }}
          >
            P
          </motion.span>
          {/* Glitch overlay */}
          <motion.span
            className="absolute top-0 left-0 text-[var(--accent-blue)] opacity-50 select-none pointer-events-none"
            animate={{
              x: [-2, 2, -1, 0],
              y: [1, -1, 0],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatDelay: Math.random() * 5 + 2
            }}
          >
            P
          </motion.span>
        </motion.div>

        {/* ROJECT with matrix rain effect */}
        <motion.div
          className="relative overflow-hidden"
          animate={{
            textShadow: [
              "0 0 10px rgba(0,255,255,0.3)",
              "0 0 20px rgba(0,255,255,0.5)",
              "0 0 10px rgba(0,255,255,0.3)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-[var(--terminal-green)] via-cyan-400 to-[var(--accent-blue)] bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            ROJECT
          </motion.span>
          {/* Matrix rain overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--terminal-green)]/10 to-transparent pointer-events-none"
            animate={{
              y: [-20, 20]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* X with reactor core effect */}
        <motion.div
          className="relative ml-2"
        >
          {/* X with glitch effect */}
          <motion.div
            className="relative inline-block font-bold text-[var(--accent-blue)]"
            animate={{
              x: [0, -3, 3, -2, 0],
              filter: [
                "hue-rotate(0deg) brightness(1)",
                "hue-rotate(90deg) brightness(1.2)",
                "hue-rotate(180deg) brightness(1.5)",
                "hue-rotate(270deg) brightness(1.2)",
                "hue-rotate(360deg) brightness(1)"
              ]
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: Math.random() * 2
            }}
          >
            X
          </motion.div>
          {/* Glitch overlay */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full text-[var(--terminal-green)] font-bold mix-blend-screen"
            animate={{
              opacity: [0, 0.8, 0],
              x: [-5, 5, -2, 0],
              y: [2, -2, 0]
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatDelay: Math.random() * 3
            }}
          >
            X
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--terminal-dark)]">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="w-full h-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,255,187,0.15) 0%, transparent 70%)',
            }}
            animate={{
              opacity: [0.5, 0.7, 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[var(--terminal-green)]/30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }}
              animate={{
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}

          <motion.div
            className="w-full h-full absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, transparent 80%)',
            }}
            animate={{
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
      </div>
      
      {/* Dark vignette edges */}
      <div className="fixed inset-0 z-[2] pointer-events-none">
        {/* Top edge */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent opacity-90" />
        {/* Bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent opacity-90" />
        {/* Left edge */}
        <div className="absolute top-0 left-0 bottom-0 w-48 bg-gradient-to-r from-black to-transparent opacity-90" />
        {/* Right edge */}
        <div className="absolute top-0 right-0 bottom-0 w-48 bg-gradient-to-l from-black to-transparent opacity-90" />
        {/* Corner overlays for stronger effect */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_0%_0%,rgba(0,0,0,0.9)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_100%_0%,rgba(0,0,0,0.9)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_0%_100%,rgba(0,0,0,0.9)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.9)_0%,transparent_70%)]" />
      </div>

      {/* Animated corner decorations */}
      {/* Enhanced corner decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner, i) => (
        <motion.div
          key={corner}
          className={`absolute w-96 h-96 ${
            corner === 'top-left' ? 'top-0 left-0 border-l-2 border-t-2' :
            corner === 'top-right' ? 'top-0 right-0 border-r-2 border-t-2' :
            corner === 'bottom-left' ? 'bottom-0 left-0 border-l-2 border-b-2' :
            'bottom-0 right-0 border-r-2 border-b-2'
          } border-[var(--terminal-green)]/80`}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1],
            filter: [
              'hue-rotate(0deg) brightness(1)',
              'hue-rotate(90deg) brightness(1.2)',
              'hue-rotate(0deg) brightness(1)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1
          }}
        >
          {/* Corner dots */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-[var(--terminal-green)]"
            style={{
              top: corner.includes('top') ? '-1px' : 'auto',
              bottom: corner.includes('bottom') ? '-1px' : 'auto',
              left: corner.includes('left') ? '-1px' : 'auto',
              right: corner.includes('right') ? '-1px' : 'auto'
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        </motion.div>
      ))}

      {/* Glowing orb effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,187,0.05) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-4 text-center px-3 relative z-10"
      > 
        <h1 className="text-3xl font-bold">
          <ProjectXLogo />
        </h1>
        
        <motion.p
          className="text-[var(--terminal-green)] text-sm font-mono"
          animate={{
            textShadow: ['0 0 12px var(--terminal-green)', '0 0 24px var(--terminal-green)', '0 0 12px var(--terminal-green)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          QUANTUM NEURAL INTERFACE v0.0.1
        </motion.p>

        <motion.div
          className="p-3 bg-black/40 rounded-lg terminal-border backdrop-blur-sm relative overflow-hidden shadow-[0_0_50px_rgba(0,255,187,0.1)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Scanning effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--terminal-green)]/10 to-transparent"
            animate={{ 
              y: [-500, 500]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <div className="relative">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { Icon: Eye, text: "NEURAL LINK", active: true },
                { Icon: Binary, text: "QUANTUM SYNC", active: true },
                { Icon: Shield, text: "SECURITY", active: true },
                { Icon: Scan, text: "SCAN", active: true }
              ].map(({ Icon, text }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-[var(--highlight-blue)]/90 border border-[var(--terminal-green)] shadow-[0_0_15px_rgba(0,255,187,0.2)]"
                >
                  <Icon className="w-4 h-4 text-[var(--accent-blue)]" />
                  <span className="text-xs font-mono text-[var(--accent-blue)]">{text}</span>
                  <div className="flex items-center gap-1">
                    <motion.div
                     className="w-1.5 h-1.5 rounded-full bg-[var(--terminal-green)]"
                      animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="text-[10px] text-[var(--terminal-green)] font-bold tracking-wider ml-1">
                      ACTIVE
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-1.5 mb-3 font-mono border-y border-[var(--terminal-green)] py-2">
              <div className="flex items-center justify-center">
                <span className="text-red-500 font-bold tracking-wider">
                  [
                </span>
                <motion.span
                  animate={{
                    opacity: [1, 0.5, 1],
                    textShadow: [
                      '0 0 20px rgba(239,68,68,0.5)',
                      '0 0 30px rgba(239,68,68,0.8)',
                      '0 0 20px rgba(239,68,68,0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-red-500 font-bold tracking-wider mx-2"
                >
                  WARNING
                </motion.span>
                <span className="text-red-500 font-bold tracking-wider">
                  ]: CLASSIFIED SYSTEM ACCESS
                </span>
              </div>
              <p className="text-[var(--accent-blue)] text-[10px]">
                By entering this system, you acknowledge that you are accessing classified information
                protected by quantum encryption and neural firewalls.
              </p>
              <p className="text-[var(--accent-blue)] text-[10px]">
                Unauthorized access will be traced and prosecuted.
              </p>
            </div>
          
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/dashboard"
                className="group relative block w-full px-3 py-2 bg-[var(--accent-blue)]/5 hover:bg-[var(--accent-blue)]/10
                  text-[var(--accent-blue)] rounded-lg transition-all duration-500 border border-[var(--terminal-green)]
                  hover:border-[var(--terminal-green)] shadow-[0_0_30px_rgba(0,255,187,0.2)]
                  hover:shadow-[0_0_40px_rgba(0,255,187,0.3)] overflow-hidden"
              >
                <span className="relative font-mono tracking-[0.2em] text-xs">
                  INITIALIZE NEURAL INTERFACE
                </span>
              </Link>
            </motion.div>

            <div className="mt-3 flex items-center justify-between text-[9px] text-[var(--terminal-green)]/40 font-mono">
              <div className="flex items-center gap-1">
                <span className="text-[var(--accent-blue)]">[SYSTEM STATUS:</span>
                <span className="text-[var(--terminal-green)]">READY</span>
                <span className="text-[var(--accent-blue)]">]</span>
              </div>
              <div className="flex items-center gap-1">
                <motion.div 
                  className="w-1 h-1 rounded-full bg-[var(--terminal-green)]"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="tracking-wider text-[var(--terminal-green)] animate-pulse">STANDBY</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}