import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { menuItems } from './Sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function MobileSidebar({ isOpen, setIsOpen }: MobileSidebarProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                type: 'spring', 
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              className="fixed left-0 top-12 bottom-0 w-[min(85vw,320px)] bg-black/40 border-r border-[var(--terminal-green)]/30 px-4 py-4 z-[61] backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-[var(--terminal-green)]/70 uppercase tracking-wider">
                  Navigation
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-4 p-2 text-[var(--terminal-green)]/60 hover:text-[var(--terminal-green)] rounded-lg hover:bg-[var(--terminal-green)]/10 transition-colors min-h-[44px] min-w-[44px]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
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
                        return isActive
                          ? `${baseClasses} bg-[var(--terminal-green)]/10 text-[var(--terminal-green)] border border-[var(--terminal-green)] shadow-[0_0_15px_rgba(0,255,187,0.2)] font-medium`
                          : `${baseClasses} text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/5`;
                      }}
                      onClick={() => {
                        setIsOpen(false);
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
                      {
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
                      }

                      {/* Hover/Active animation */}
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
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileSidebar;