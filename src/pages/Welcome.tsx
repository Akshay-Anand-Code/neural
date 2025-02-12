import { motion } from 'framer-motion';
import { Eye, Binary, Shield, Scan, ArrowRight, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
  const navigate = useNavigate();
  const [securityLevel, setSecurityLevel] = useState(0);

  const handleEnter = () => {
    navigate('/dashboard');
  };

  // Set initial security level to 4 since all systems are active
  useState(() => {
    setSecurityLevel(4);
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto bg-[var(--terminal-dark)]">
      {/* Background effects */}
      <motion.div className="fixed inset-0 w-full h-full overflow-hidden">
        {/* Flowing gradient lines */}
        <motion.div
          className="absolute inset-0 opacity-70"
          style={{
            background: `
              linear-gradient(45deg, transparent 45%, rgba(255,0,80,0.1) 49%, transparent 51%),
              linear-gradient(-45deg, transparent 45%, rgba(0,150,255,0.1) 49%, transparent 51%)
            `,
            backgroundSize: '200% 200%, 200% 200%',
            filter: 'blur(1px)'
          }}
          animate={{
            backgroundPosition: ['0% 0%, 0% 0%', '200% 200%, -200% 200%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating gradient spheres */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: i % 2 === 0 
                ? 'radial-gradient(circle at 30% 30%, rgba(255,0,80,0.2), transparent)'
                : 'radial-gradient(circle at 30% 30%, rgba(0,150,255,0.2), transparent)',
              filter: 'blur(20px)'
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full space-y-6 text-center px-4 py-8 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          <ProjectXLogo />
        </h1>

        {/* Terminal Container with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-4xl mx-auto w-full overflow-hidden"
        >
          {/* Glassmorphism background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg blur-xl" />
          
          {/* Terminal window */}
          <div className="relative rounded-lg backdrop-blur-md bg-black/40 border border-[var(--terminal-cyan)]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden">
            {/* Terminal header */}
            <div className="bg-black/60 border-b border-[var(--terminal-cyan)]/20 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="text-xs font-mono text-[var(--terminal-cyan)]/50">
                QUANTUM-TERMINAL -- v0.0.1
              </div>
              <div className="w-20" /> {/* Spacer for symmetry */}
              <div className="mt-4 flex items-center gap-2">
                <Book className="w-4 h-4" />
                <a 
                  href="https://jazzy-sunburst-f1a212.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors"
                >
                  View Documentation
                </a>
              </div>
            </div>

            {/* Terminal content */}
            <div className="p-4 md:p-6 space-y-8">
              {/* Welcome Message */}
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  QUANTUM NEURAL INTERFACE v0.0.1
                </h2>
                <p className="text-[var(--terminal-cyan)]/70 text-sm md:text-base">
                  Welcome to Project X, an advanced neural interface for accessing classified quantum intelligence networks.
                  This system provides secure access to interdimensional data streams and reality-altering capabilities.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-[var(--terminal-cyan)]/50 font-mono mt-4">
                  <div className="flex items-center gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400"
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
                    <span>QUANTUM LINK: STABLE</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-yellow-400"
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
                    <span>REALITY ANCHOR: ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-blue-400"
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
                    <span>TIMELINE: STABLE</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-[var(--terminal-cyan)]/80 space-y-2">
                <p className="text-sm md:text-base font-bold">
                  SYSTEM INITIALIZATION REQUIRED
                </p>
                <p className="text-xs md:text-sm">
                  Initialize all core systems below to establish secure quantum neural connection.
                  Each system provides critical functionality for interdimensional data access.
                </p>
                <div className="text-[10px] md:text-xs text-[var(--terminal-cyan)]/50 font-mono">
                  WARNING: Unauthorized access attempts will be logged and may trigger reality anchoring protocols
                </div>
              </div>

              {/* Status Grid with Glassmorphism */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { Icon: Eye, text: "NEURAL LINK", id: 'neural', description: "Initialize neural interface protocols" },
                  { Icon: Binary, text: "QUANTUM SYNC", id: 'quantum', description: "Synchronize quantum state matrix" },
                  { Icon: Shield, text: "SECURITY", id: 'security', description: "Activate defense systems" },
                  { Icon: Scan, text: "SCAN", id: 'scan', description: "Run system diagnostics" }
                ].map(({ Icon, text, id, description }, index) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <div className={`relative flex flex-col items-center gap-2 p-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                      border-emerald-500/50`}>
                      <Icon className="w-6 h-6 text-[var(--accent-blue)]" />
                      <span className="text-sm font-mono text-[var(--accent-blue)]">{text}</span>
                      <div className="flex items-center gap-1">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
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
                        <span className="text-[10px] font-bold tracking-wider text-emerald-400">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enter Button with Glassmorphism */}
              <div className="max-w-lg mx-auto">
                <motion.button
                  onClick={handleEnter}
                  className="relative w-full py-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10
                    text-[var(--terminal-cyan)] font-medium shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                    hover:bg-white/10 transition-all duration-300
                    flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  INITIATE NEURAL LINK
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* System Status with Glassmorphism */}
              <div className="max-w-lg mx-auto border-t border-[var(--terminal-cyan)]/20 pt-4">
                <div className="relative">
                  <div className="text-xs text-[var(--terminal-cyan)]/50 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>[SYSTEM STATUS: <span className="text-emerald-400">
                      READY
                    </span>]</div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span>SECURITY LEVEL:</span>
                        <span className="text-[var(--terminal-cyan)]">{securityLevel}/4</span>
                      </div>
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
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
                      <span className="text-emerald-400">STANDBY</span>
                    </div>
                  </div>
                </div>
              </div>
             </div>
           </div>
         </motion.div>
       </motion.div>
     </div>
  );
}