import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { useAgentStore } from '../store/useAgentStore';
import ChatInterface from '../components/ChatInterface';
import Banner3D from '../components/Banner3D';
import type { Agent } from '../types/agent';

interface AgentButtonProps {
  agent: Agent;
  index: number;
  selectedAgent: Agent | null;
  onSelect: (id: string) => void;
}

const AgentButton = motion(React.forwardRef<HTMLDivElement, AgentButtonProps>(({ agent, index, selectedAgent, onSelect }, ref) => {
  const animations = {
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
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: index * 0.1
      }
    }
  } as const;

  return (
    <motion.div {...animations} ref={ref}>
      <button
        type="button"
        onClick={() => onSelect(agent.id)}
        className={`w-full p-4 rounded-lg border-2 transition-all relative cursor-pointer ${
          selectedAgent?.id === agent.id
            ? 'border-[var(--accent-blue)] bg-blue-900/20 shadow-[0_0_15px_rgba(0,51,255,0.2)]'
            : 'border-gray-700 hover:border-[var(--accent-blue)]/50 hover:shadow-[0_0_10px_rgba(0,51,255,0.15)]'
        } focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/50 focus:border-[var(--accent-blue)]`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={agent.avatarUrl}
              alt={agent.name}
              className="w-16 h-16 rounded-full object-cover ring-1 ring-cyan-500/30"
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-cyan-500/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          <div className="text-left">
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

export default function Agents() {
  const { agents, selectedAgent, selectAgent, loadAgents } = useAgentStore();
  const [isLoading, setIsLoading] = useState(true);

  const initializeAgents = useCallback(async () => {
    setIsLoading(true);
    try {
      await loadAgents();
    } catch (error) {
      console.error('Error initializing agents:', error);
      // Show error state to user
      setError('Failed to load agents. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  }, [loadAgents]);

  // Add error state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAgents();
  }, [initializeAgents]);

  // Preload all agent images when component mounts
  useEffect(() => {
    agents.forEach(agent => {
      const img = new Image();
      img.src = agent.avatarUrl;
    });
  }, [agents]);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 relative overflow-y-auto">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-gradient-shift" />
      <div className="absolute inset-0 backdrop-blur-[100px]" />

      {/* Banner */}
      <div className="h-[100px] sm:h-[120px] relative rounded-lg overflow-hidden mb-4">
        <Banner3D />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-black/20 to-black/50 z-[2]" />
        
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-[5]">
          <div className="relative">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--terminal-cyan)] flex flex-col sm:block items-center"
              animate={{
                textShadow: [
                  "0 0 20px rgba(0,255,255,0.6)",
                  "0 0 40px rgba(0,255,255,0.8)",
                  "0 0 20px rgba(0,255,255,0.6)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                className="inline-block mb-2 sm:mb-0 tracking-wider"
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
                <span>AGENTS</span>
              </motion.span>
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={false}
          animate={{
            gridColumn: selectedAgent ? "1" : "1 / -1",
            height: selectedAgent ? "auto" : "auto"
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="space-y-1.5 sm:space-y-2 bg-black/40 p-4 md:p-6 rounded-lg backdrop-blur-md border border-[var(--terminal-cyan)]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full relative z-20 overflow-hidden"
        >
          {/* Show error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"
            animate={{
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <h2 className="text-sm sm:text-base font-semibold text-[var(--terminal-green)] mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
            <Eye className="w-6 h-6" />
            SELECT AGENT
          </h2>
          <div className="grid gap-2 sm:gap-4 w-full relative z-30">
            {!isLoading && agents.map((agent, index) => (
              <AgentButton
                key={agent.id}
                agent={agent}
                index={index}
                selectedAgent={selectedAgent}
                onSelect={selectAgent}
              />
            ))}
          </div>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <Loader2 className="w-8 h-8 animate-spin text-[var(--terminal-green)]" />
            </motion.div>
          )}
        </motion.div>

        {selectedAgent && (
          <motion.div 
            className="col-span-3 flex flex-col h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)] relative z-10 bg-black/40 rounded-lg backdrop-blur-md border border-[var(--terminal-cyan)]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated circuit lines */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M0 50 L100 50 L150 100 L200 0"
                stroke="rgba(0, 255, 255, 0.1)"
                strokeWidth="1"
                fill="none"
                animate={{
                  strokeDashoffset: [0, 100],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </svg>
            <ChatInterface />
          </motion.div>
        )}
      </div>
    </div>
  );
}