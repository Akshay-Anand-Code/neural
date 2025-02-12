import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Star, Shield, Zap, Scroll, Package, Award, MessageSquare } from 'lucide-react';
import { useRPGStore } from '../store/useRPGStore';
import RPGChat from './RPGChat';
import type { InventoryItem } from '../types/rpg';

export default function RPGInterface() {
  const [activeTab, setActiveTab] = useState<'status'|'inventory'|'quests'|'chat'>('chat');
  const [isMobile, setIsMobile] = useState(false);
  const { level, experience, skills, inventory, activeQuests, reputation } = useRPGStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-full flex flex-col p-4 sm:p-0 relative">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-gradient-shift" />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Fixed Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 glass-panel p-4 rounded-lg sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-[var(--terminal-cyan)]" />
            <h2 className="text-lg font-bold text-[var(--terminal-cyan)]">
              NEURAL RPG INTERFACE
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Level {level}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Rep {reputation}</span>
            </div>
          </div>
        </div>

        {/* Fixed Navigation */}
        <div className="flex flex-wrap gap-2 mb-4 p-2 sm:p-4 glass-panel rounded-lg z-20">
          {[
            { id: 'chat', icon: MessageSquare, label: 'Chat' },
            { id: 'status', icon: Zap, label: 'Status' },
            { id: 'inventory', icon: Package, label: 'Inventory' },
            { id: 'quests', icon: Scroll, label: 'Quests' }
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all flex-1 sm:flex-initial justify-center backdrop-blur-md ${
                activeTab === tab.id
                  ? 'glass-panel text-[var(--terminal-cyan)] shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                  : 'text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] glass-button'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-[calc(100vh-20rem)]"
              >
                <RPGChat />
              </motion.div>
            )}

            {activeTab === 'status' && (
              <motion.div
                key="status"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 p-4 glass-panel rounded-lg"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(skills).map(([skill, level]) => (
                    <div
                      key={skill}
                      className="glass-panel rounded-lg p-3"
                    >
                      <div className="text-sm text-[var(--terminal-cyan)]/70 mb-1">
                        {skill.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-[var(--terminal-cyan)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${level}%` }}
                          />
                        </div>
                        <span className="text-sm">{level}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-panel rounded-lg p-3">
                  <div className="text-sm text-[var(--terminal-cyan)]/70 mb-1">
                    EXPERIENCE
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(experience % 100)}%` }}
                      />
                    </div>
                    <span className="text-sm">{experience}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 glass-panel rounded-lg"
              >
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="glass-panel rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium text-[var(--terminal-cyan)]">
                          {item.name}
                        </div>
                        <div className="text-xs text-[var(--terminal-cyan)]/70 mt-1">
                          {item.description}
                        </div>
                      </div>
                      <Award className={`w-4 h-4 ${
                        item.rarity === 'legendary' ? 'text-yellow-400' :
                        item.rarity === 'rare' ? 'text-blue-400' :
                        'text-gray-400'
                      }`} />
                    </div>
                    {Object.entries(item.effects).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[var(--terminal-cyan)]/10">
                        <div className="text-xs text-[var(--terminal-cyan)]/70">
                          Effects:
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {Object.entries(item.effects).map(([stat, value]) => (
                            <div
                              key={stat}
                              className="text-xs flex items-center gap-1"
                            >
                              <span className="text-[var(--terminal-cyan)]/50">
                                {stat}:
                              </span>
                              <span className={value >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                {value >= 0 ? '+' : ''}{value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'quests' && (
              <motion.div
                key="quests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 p-4 glass-panel rounded-lg"
              >
                {activeQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="glass-panel rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium text-[var(--terminal-cyan)]">
                          {quest.title}
                        </div>
                        <div className="text-xs text-[var(--terminal-cyan)]/70 mt-1">
                          {quest.description}
                        </div>
                      </div>
                      <div className="text-xs text-[var(--terminal-cyan)]/50">
                        {quest.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {quest.objectives.map((objective) => (
                        <div
                          key={objective.id}
                          className="flex items-center gap-2"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            objective.completed ? 'bg-emerald-400' : 'bg-[var(--terminal-cyan)]/30'
                          }`} />
                          <div className="flex-1 text-xs text-[var(--terminal-cyan)]/70">
                            {objective.description}
                          </div>
                          <div className="text-xs text-[var(--terminal-cyan)]/50">
                            {objective.progress}/{objective.required}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}