import { motion } from 'framer-motion';

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
          className="relative text-4xl sm:text-3xl"
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
          className="relative overflow-hidden text-4xl sm:text-3xl"
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
            style={{ filter: 'blur(8px)' }}
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
          className="relative ml-2 text-4xl sm:text-3xl"
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

export default ProjectXLogo;