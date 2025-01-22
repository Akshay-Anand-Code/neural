import { motion } from 'framer-motion';

export default function ScanLines() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Primary scan lines with reduced contrast */}
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          )`,
          backgroundSize: '100% 2px',
          mixBlendMode: 'multiply',
          opacity: 0.3
        }}
      />

      {/* Subtle green scan lines */}
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 255, 187, 0.05) 0px,
            rgba(0, 255, 187, 0.05) 1px,
            transparent 1px,
            transparent 2px
          )`,
          backgroundSize: '100% 2px',
          mixBlendMode: 'overlay',
          opacity: 0.3
        }}
      />

      {/* Moving scan line effect - more subtle */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            0deg,
            transparent 0%,
            rgba(0, 255, 187, 0.05) 10%,
            rgba(0, 255, 187, 0.03) 50%,
            transparent 90%
          )`,
          mixBlendMode: 'screen',
          opacity: 0.3
        }}
        animate={{
          y: ['-100%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Very subtle CRT flicker */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.03)',
          animation: 'flicker 0.15s infinite alternate'
        }}
      />

      {/* Reduced vignette effect */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0, 20, 10, 0.4) 100%)',
          mixBlendMode: 'multiply',
          opacity: 0.3
        }}
        animate={{
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Very subtle noise overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPmSURBVGiB7ZpNiFVVHMZ/z7kzY2MOhCRUViBRQRG0CTJoYZuEaGFQi4jaBQW6alazcDGLNrWQaNOqRbQJIgKJFkEUFBW0CSGQhBBkkHQGnRmdGZ3Xp8W5l3vPPffeOXPvnXuR84DD+Z//ed7Oued9zr1QUVFRUVFRUTFw6P+eQJ4kzQEWAHcCdwA3AjcBw8AwMAWcByaAE8Bx4DhwGjhpZv/0Y869EZJ0q6QXJR2WdFndc1nSIUkvSLqlH/PvipDuSXoYeBW4O2f4LHAaOAVMAheB6Wh8DnA9cAtwOzDUxn8C2Ai8YWZTBeafjaQhSeslnYl2clrSXkkbJD0gaXaGz2xJD0raKGmfpD8z/J6WtE7S1UXPvxBJ90vaL6ku6YikVZKGu/Q7LOlRSUcj33VJ+yTdV2QOhUiStFrS35LOSnrczIoNJGmhpGck/SbpH0mrVPbOSFog6ZCkK5LWmlnhe2FmSHpO0pSkHWY2UaLvPEk7JV2W9GzpQiStk3RJ0gtl+s1A0kpJf0laW7Zvz0haI+lvSSvK9p2BpE2SLkha3CvfroVIWgr8CDxpZrt7nUgWkp4APgCWmdmxsnwHJQ0BPwM7zGxDWZNIQ9LbwBxgRZlPvUFJNwA/AO+Z2aYyJ5KGpM3AbcB9ZjZdll+tLMcUngYuA2+V7FfzfQN4CXiqTLFBiU+tJZL2SDoj6f0iJ5FxvTmSdkv6VdLSIn0ykbRI0nFJRyUt6NWvyB25G/gMOGhma3v0uQpJzwPvAsvN7Mcifdt5FSFpEfAlsNXMtnfr0wlJW4EVwD1m9ldPzmY2kC9gCPgG2DbIeQBvAz8Bc3v1KERS7QoMAV8DnwPzBzSHYeBz4Ctgbq9+Re7I3cAe4ICZPVeA/1VI2gJsBJaZ2eFefYsSsgD4DthrZuuL8E9D0mbgKWCpmZ0qwrPI1+8PgbeBN4vwTUPSW8BzwENmdrIo30KEAEi6FtgPfGRmG4vyj/1vAT4GlpvZz0X6FilkLvAl8ImZvVqUf+x7G7ALeMTMfi3at7AeQdIwsAe4AKwqagckzQP2AheBx6yMjk7SoLreN4FrKEgEgJldAFYC10l6owjPJoVtv6QJM/u0oLn8h5n9IWklcFDSeTN7rxffwnZE0mrgPWCxmZ0rxCkDSfOBQ8A2M3u9F6/ChEh6HPgQWGJmvxfilIGk64GvgZ1mtrUXr0KERC/Xw8AOM9tWhE87JN0JHADeNbOdvXgV9dRaDUwCHxTk1xYzOwysA7ZLWtSLVyE7IulnYNTMLvfs1CGSrgF+AY6Z2SO9+PTcEEkaBeYNSgSAmV0CHgMWS1rdi1cRT63ZwKKSO962mNk5SU8CB3rx6VmImVVfhBUVFRUVFRUV/cO/pFqgKeggXYoAAAAASUVORK5CYII=)',
          opacity: 0.02,
          mixBlendMode: 'overlay'
        }}
      />

      <style>
        {`
          @keyframes flicker {
            0% { opacity: 0.98; }
            100% { opacity: 1; }
          }
          
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}
      </style>
    </div>
  );
}