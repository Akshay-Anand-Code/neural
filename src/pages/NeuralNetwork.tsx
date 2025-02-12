import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Gamepad } from 'lucide-react';
import { useRPGStore } from '../store/useRPGStore';
import RPGInterface from '../components/RPGInterface';
import Banner3D from '../components/Banner3D';

export default function NeuralNetwork() {
  const { level } = useRPGStore();

  useEffect(() => {
    const checkMobile = () => {
      // Mobile check logic can be used directly in components that need it
      return window.innerWidth < 1024;
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-0 sm:p-4 relative overflow-y-auto">
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
                <span>QUANTUM RPG</span>
              </motion.span>
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto relative z-10 min-h-[calc(100vh-12rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-2 p-4 sm:p-0 bg-black/40 backdrop-blur-md border-b border-[var(--terminal-cyan)]/20 relative z-[60] sticky top-0"
        >
          <div className="flex items-center gap-3">
            <Gamepad className="w-6 h-6 text-[var(--terminal-cyan)]" />
            <h1 className="text-xl font-bold text-[var(--terminal-cyan)]">
              QUANTUM RPG
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--terminal-cyan)]" />
              <motion.span
                className="relative"
                animate={{
                  textShadow: [
                    '0 0 4px rgba(0,255,187,0.5)',
                    '0 0 8px rgba(0,255,187,0.8)',
                    '0 0 4px rgba(0,255,187,0.5)'
                  ],
                  color: [
                    'rgba(0,255,187,1)',
                    'rgba(0,255,187,0.8)',
                    'rgba(0,255,187,1)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                LEVEL: {level}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* RPG Interface */}
        <div className="bg-black/40 backdrop-blur-md sm:rounded-lg border-y sm:border border-[var(--terminal-cyan)]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden h-full">
          <RPGInterface />
        </div>
      </div>
    </div>
  );
}