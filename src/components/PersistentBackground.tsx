import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ConspiracyWords from './ConspiracyWords';
import ScanLines from './ScanLines';

const VIGNETTE_OPACITY = '0.03';
const VIGNETTE_SIZE = '16';

export default function PersistentBackground() {
  const location = useLocation();

  return (
    <div className="fixed inset-0 z-[1] overflow-hidden w-full h-full">
      {/* Conspiracy words layer */}
      <ConspiracyWords />

      {/* Dark vignette edges */}
      <div className="fixed inset-0 pointer-events-none w-full h-full">
        {/* Top edge */}
        <div className={`absolute top-0 left-0 right-0 h-${VIGNETTE_SIZE} bg-gradient-to-b from-[#001a1a] to-transparent opacity-${VIGNETTE_OPACITY} w-full`} />
        {/* Bottom edge */}
        <div className={`absolute bottom-0 left-0 right-0 h-${VIGNETTE_SIZE} bg-gradient-to-t from-[#001a1a] to-transparent opacity-${VIGNETTE_OPACITY} w-full`} />
        {/* Left edge */}
        <div className={`absolute top-0 left-0 bottom-0 w-${VIGNETTE_SIZE} bg-gradient-to-r from-[#001a1a] to-transparent opacity-${VIGNETTE_OPACITY} h-full`} />
        {/* Right edge */}
        <div className={`absolute top-0 right-0 bottom-0 w-${VIGNETTE_SIZE} bg-gradient-to-l from-[#001a1a] to-transparent opacity-${VIGNETTE_OPACITY} h-full`} />
        {/* Corner overlays */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_0%_0%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_0%_100%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
      </div>

      {/* Page transition overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/10 pointer-events-none w-full h-full"
        />
      </AnimatePresence>

      {/* Scan lines effect */}
      <ScanLines />
    </div>
  );
}