import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Scroll, Users, FileText, Network, Database, Shield } from 'lucide-react';

export const menuItems = [
  { icon: Scroll, label: 'Manifesto', to: '/dashboard', end: true },
  { icon: Users, label: 'Agents', to: '/dashboard/agents' },
  { icon: Network, label: 'Neural Network', to: '/dashboard/network', disabled: true },
  { icon: Database, label: 'Data Vault', to: '/dashboard/vault', disabled: true },
  { icon: Shield, label: 'Security', to: '/dashboard/security', disabled: true },
];

export default function Sidebar() {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-48 bg-[var(--terminal-dark)]/90 p-3 border-r border-[var--separator-green)] min-h-[calc(100vh-3rem)]"
    >
      <div className="space-y-2">
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
                const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm relative overflow-hidden";
                if (item.disabled) {
                  return `${baseClasses} opacity-50 cursor-not-allowed`;
                }
                if (isActive) {
                  return `${baseClasses} bg-[var(--terminal-green)]/10 text-[var(--terminal-green)] border border-[var(--terminal-green)] shadow-[0_0_15px_rgba(0,255,187,0.2)] font-bold`;
                }
                return `${baseClasses} text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/5`;
              }}
              onClick={e => item.disabled && e.preventDefault()}
            >
              <item.icon className={`w-5 h-5 transition-colors duration-200`} />
              <span>{item.label}</span>
              {item.disabled && (
                <span className="ml-auto text-xs opacity-50">LOCKED</span>
              )}
              {!item.disabled && (
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
              )}
            </NavLink>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}