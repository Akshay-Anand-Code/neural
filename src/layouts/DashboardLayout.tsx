import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Eye, Binary, Shield, Scan } from 'lucide-react';
import MobileSidebar from '../components/MobileSidebar';

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

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[var(--terminal-dark)] text-[var(--terminal-green)] relative">
      
      <div className="relative z-[3] flex flex-col min-h-screen bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]">
        <header className="relative z-10 bg-[var(--terminal-dark)]/90 border-b border-[var(--separator-green)] backdrop-blur-sm h-12">
          <div className="container mx-auto px-3 py-2 flex items-center justify-between">
            <Link to="/" className="text-xl sm:text-2xl md:text-3xl font-bold hover:opacity-80 transition-opacity">
              <ProjectXLogo />
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-mono">
              {[
                { Icon: Eye, text: "NEURAL LINK", active: true },
                { Icon: Binary, text: "QUANTUM SYNC", active: true },
                { Icon: Shield, text: "SECURITY", active: true },
                { Icon: Scan, text: "SCAN", active: true }
              ].map(({ Icon, text }) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-2 text-[var(--accent-blue)]"
                  whileHover={{ scale: 1.05, color: 'var(--terminal-green)' }}
                >
                  <Icon className="w-4 h-4" />
                  <div className="flex items-center gap-2 select-none">
                    <span>{text}</span>
                    <div className="flex items-center gap-1">
                      <motion.div
                        className="w-1 h-1 rounded-full bg-[var(--separator-green)] shadow-[0_0_8px_var(--terminal-green)] inline-block"
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
                      <span className="text-[9px] text-[var(--terminal-green)] font-bold tracking-wider ml-1">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex md:hidden items-center gap-2">
              {[Shield, Scan].map((Icon, i) => (
                <motion.div
                  key={i}
                  className="p-2 text-[var(--terminal-green)]/60 relative select-none"
                  whileHover={{ scale: 1.05, color: 'var(--terminal-green)' }}
                >
                  <Icon className="w-5 h-5" />
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--terminal-green)]"
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
                </motion.div>
              ))}
            </div>
          </div>
        </header>
        
        <div className="flex-1 flex flex-col md:flex-row">
          <div className="md:hidden">
            <MobileSidebar />
          </div>
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}