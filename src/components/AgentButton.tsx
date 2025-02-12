import { motion, MotionProps } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import type { Agent } from '../types/agent';

interface AgentButtonProps {
  agent: Agent;
  index: number;
  selectedAgent: Agent | null;
  onSelect: (id: string) => void;
}

const ImageWithPreload = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImageLoaded(true);
  }, [src]);

  return (
    <div className="relative w-16 h-16">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-[var(--terminal-dark)] rounded-full animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading="lazy"
      />
    </div>
  );
};

const buttonAnimations = {
  initial: { 
    opacity: 0,
    x: -30,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

const AgentButton = motion(React.forwardRef<HTMLDivElement, AgentButtonProps>(({ agent, selectedAgent, onSelect }, ref) => {
  return (
    <motion.div {...buttonAnimations} ref={ref}>
      <button
        type="button"
        onClick={() => onSelect(agent.id)}
        className={`w-full p-4 rounded-lg transition-all relative cursor-pointer backdrop-blur-md ${
          selectedAgent?.id === agent.id
            ? 'bg-[var(--terminal-cyan)]/10 border border-[var(--terminal-cyan)] shadow-[0_0_20px_rgba(0,255,255,0.2)]'
            : 'bg-black/30 border border-[var(--terminal-cyan)]/20 hover:border-[var(--terminal-cyan)]/40 hover:bg-[var(--terminal-cyan)]/5'
        } focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/50 focus:border-[var(--accent-blue)]`}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-lg"
          animate={{
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="flex items-center gap-4">
          <div className="relative">
            <ImageWithPreload
              src={agent.avatarUrl}
              alt={agent.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[var(--terminal-cyan)]/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
            />
            <motion.div
              className="absolute inset-0 rounded-full ring-2 ring-[var(--terminal-cyan)]/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          <div className="text-left relative z-10">
            <h3 className="text-lg font-semibold tracking-wide">{agent.name}</h3>
            <p className="text-sm bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {agent.title}
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  );
}));

AgentButton.displayName = 'AgentButton';

export default AgentButton;