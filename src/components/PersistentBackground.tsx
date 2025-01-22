import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useBackgroundStore } from '../store/useBackgroundStore';
import MatrixRain from './MatrixRain';
import ConspiracyWords from './ConspiracyWords';
import ScanLines from './ScanLines';

export default function PersistentBackground() {
  const location = useLocation();
  const matrixSeed = useBackgroundStore((state) => state.matrixSeed);

  return (
    <div className="fixed inset-0 z-[1]">
      {/* Base layer with persistent matrix effect */}
      <div className="absolute inset-0" key={matrixSeed}>
        <MatrixRain />
      </div>

      {/* Conspiracy words layer */}
      <ConspiracyWords />

      {/* Dark vignette edges */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top edge */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent opacity-80" />
        {/* Bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent opacity-80" />
        {/* Left edge */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent opacity-80" />
        {/* Right edge */}
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent opacity-80" />
        {/* Corner overlays */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_0%_0%,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_0%,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_0%_100%,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.8)_0%,transparent_70%)]" />
      </div>

      {/* Page transition overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/20 pointer-events-none"
        />
      </AnimatePresence>

      {/* Scan lines effect */}
      <ScanLines />
    </div>
  );
}