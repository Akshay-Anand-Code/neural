import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { menuItems } from './Sidebar';

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="sticky top-4 left-4 z-50 p-2 bg-[var(--terminal-dark)]/90 rounded-lg border border-[var(--terminal-green)]"
      >
        <Menu className="w-6 h-6 text-[var(--terminal-green)]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--terminal-dark)] border-r border-[var(--terminal-green)] p-4 z-50"
            >
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[var(--terminal-green)]/60 hover:text-[var(--terminal-green)]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

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
                        const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden";
                        if (item.disabled) {
                          return `${baseClasses} opacity-50 cursor-not-allowed`;
                        }
                        if (isActive) {
                          return `${baseClasses} bg-[var(--terminal-green)]/10 text-[var(--terminal-green)] border border-[var(--terminal-green)] shadow-[0_0_15px_rgba(0,255,187,0.2)] font-bold`;
                        }
                        return `${baseClasses} text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/5`;
                      }}
                      onClick={(e) => {
                        if (item.disabled) {
                          e.preventDefault();
                        } else {
                          setIsOpen(false);
                        }
                      }}
                    >
                      <item.icon className="w-5 h-5 transition-colors duration-200" />
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
          </>
        )}
      </AnimatePresence>
    </>
  );
}