import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { useAgentStore } from '../store/useAgentStore';
import HologramScene from '../components/HologramScene';
import ChatInterface from '../components/ChatInterface';
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
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div {...animations} ref={ref}>
      <button
        onClick={() => onSelect(agent.id)}
        className={`w-full p-4 rounded-lg border-2 transition-all ${
          selectedAgent?.id === agent.id
            ? 'border-[var(--accent-blue)] bg-blue-900/20 shadow-[0_0_15px_rgba(0,51,255,0.2)]'
            : 'border-gray-700 hover:border-[var(--accent-blue)]/50 hover:shadow-[0_0_10px_rgba(0,51,255,0.15)]'
        }`}
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
  const { agents = [], selectedAgent, selectAgent } = useAgentStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-2 md:p-4 max-w-screen-2xl mx-auto h-[calc(100vh-4rem)] overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        <motion.div
          initial={false}
          layout
          animate={{
            gridColumn: selectedAgent ? "1" : "1 / -1",
            height: "auto"
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="space-y-2 bg-[var(--terminal-dark)]/90 p-2 md:p-3 rounded-lg backdrop-blur-sm terminal-border crt w-full h-fit"
        >
          <h2 className="text-base font-semibold text-[var(--terminal-green)] mb-2 flex items-center gap-2">
            <Eye className="w-6 h-6" />
            SELECT AGENT
          </h2>
          <div className="grid gap-4 w-full">
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
            className="col-span-3 space-y-2 flex flex-col h-[calc(100vh-6rem)]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="h-[35%]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HologramScene />
            </motion.div>
            <motion.div 
              className="h-[65%]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <ChatInterface />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}