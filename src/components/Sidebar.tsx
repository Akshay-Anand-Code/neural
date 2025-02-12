import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Scroll, Users, Database, Brain, Sparkles } from 'lucide-react';

export const menuItems = [
  { icon: Scroll, label: 'Manifesto', to: '/dashboard', end: true },
  { icon: Users, label: 'Agents', to: '/dashboard/agents' },
  { icon: Brain, label: 'Quantum RPG', to: '/dashboard/network' },
  { icon: Database, label: 'Data Vault', to: '/dashboard/vault' },
  { icon: Sparkles, label: 'Conspiracy Builder', to: '/dashboard/conspiracy' },
];

export default function Sidebar() {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 glass-panel p-4 border-r min-h-[calc(100vh-3rem)] flex flex-col"
    >
      {/* Sidebar Header */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[var(--terminal-green)]/70 uppercase tracking-wider">
          Navigation
        </h2>
      </div>

      {/* Menu Items */}
      <div className="flex-1 space-y-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) => {
                const baseClasses = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm relative overflow-hidden min-h-[44px] group";
                if (isActive) {
                  return `${baseClasses} glass-panel text-[var(--terminal-green)] shadow-[0_0_15px_rgba(0,255,187,0.2)] font-medium`;
                }
                return `${baseClasses} text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] glass-button`;
              }}
            >
              {/* Icon with glow effect */}
              <div className="relative">
                <item.icon className="w-5 h-5 transition-colors duration-200" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-[var(--terminal-green)]/10"
                  initial={false}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Label */}
              <span className="flex-1">{item.label}</span>

              {/* Status indicator */}
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[var(--terminal-green)]"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Hover/Active animation */}
              <motion.div
                className="absolute inset-0 bg-[var(--terminal-green)]/5"
                initial={false}
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-[var(--terminal-green)]/10">
        <div className="text-xs text-[var(--terminal-green)]/50 flex items-center justify-between">
          <span>SYSTEM STATUS</span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-emerald-400">ONLINE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}