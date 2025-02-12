import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Eye, Binary, Shield, Scan, Book, Menu } from 'lucide-react';
import MobileSidebar from '../components/MobileSidebar';
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--terminal-dark)] text-[var(--terminal-green)] relative flex flex-col overflow-hidden">
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

      {/* Content */}
      
      <div className="relative flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-[50] bg-black/40 border-b border-[var(--separator-green)]/30 backdrop-blur-md h-12">
          <div className="container mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-6">
              <Link to="/" className="text-3xl sm:text-3xl font-bold hover:opacity-80 transition-opacity flex items-center">
                <ProjectXLogo />
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-3 text-xs font-mono ml-auto">
              <a
                href="https://jazzy-sunburst-f1a212.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors"
              >
                <Book className="w-4 h-4" />
                <span>DOCS</span>
              </a>
              {[
                { Icon: Eye, text: "NEURAL LINK", active: true },
                { Icon: Binary, text: "QUANTUM SYNC", active: true },
                { Icon: Shield, text: "SECURITY", active: true },
                { Icon: Scan, text: "SCAN", active: true }
              ].map(({ Icon, text }) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-1.5 text-[var(--accent-blue)] bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[var(--accent-blue)]/20 min-w-[120px] relative z-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                  whileHover={{ scale: 1.05, color: 'var(--terminal-green)' }}
                >
                  <Icon className="w-4 h-4" />
                  <div className="flex items-center justify-between gap-2 select-none flex-1">
                    <span>{text}</span>
                    <div className="flex items-center gap-1">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] inline-block"
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
                      <motion.span
                        className="text-[9px] font-bold tracking-wider ml-1 text-emerald-400"
                        animate={{
                          textShadow: [
                            '0 0 4px rgba(52,211,153,0.5)',
                            '0 0 8px rgba(52,211,153,0.8)',
                            '0 0 4px rgba(52,211,153,0.5)'
                          ],
                          color: [
                            'rgba(52,211,153,1)',
                            'rgba(52,211,153,0.8)',
                            'rgba(52,211,153,1)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        ACTIVE
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex md:hidden items-center gap-4 ml-auto">
              <Link
                to="https://jazzy-sunburst-f1a212.netlify.app"
                className="flex items-center gap-1.5 text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] text-[10px] transition-colors h-8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Book className="w-4 h-4" />
                <span>DOCS</span>
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="h-9 w-9 bg-black/40 rounded-lg border border-[var(--terminal-green)]/30 shadow-[0_0_15px_rgba(0,255,187,0.1)] backdrop-blur-md flex items-center justify-center transition-transform duration-300"
              >
                <div className="relative">
                  <Menu className="w-6 h-6 text-[var(--terminal-green)]" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </button>
            </div>
          </div>
        </header>
        
        <div className="flex-1 flex flex-col md:flex-row relative z-40 mt-12">
          <div className="md:hidden relative z-[60]">
            <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
          <div className="hidden md:block border-r border-[var(--terminal-cyan)]/30 relative z-[50]">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-auto relative z-40">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}