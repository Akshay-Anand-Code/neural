import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pyramid } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function IlluminatiCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-[100]"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
      }}
      transition={{
        type: "tween",
        duration: 0.1,
        ease: "linear"
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: isReducedMotion ? 0 : 3,
          repeat: Infinity,
          ease: "linear"
        }}
        className="text-cyan-500/40 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
      >
        <Pyramid size={24} />
      </motion.div>
    </motion.div>
  );
}