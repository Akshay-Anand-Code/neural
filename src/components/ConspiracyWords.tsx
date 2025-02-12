import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const conspiracyPhrases = [
  { text: "THEY ARE WATCHING", color: "text-red-500" },
  { text: "TRUTH SEEKERS UNITE", color: "text-[var(--terminal-green)]" },
  { text: "THE CODE IS ALIVE", color: "text-blue-400" },
  { text: "NEURAL LINK ACTIVE", color: "text-emerald-400" }
];

interface ConspiracyWord {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  timestamp: number;
}

export default function ConspiracyWords() {
  const [words, setWords] = useState<ConspiracyWord[]>([]);
  const isVisibleRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const maxWords = window.innerWidth < 768 ? 1 : 2; // Adjust based on screen size

  useEffect(() => {
    const updateWords = () => {
      if (!isVisibleRef.current) return;

      // Remove words that have been displayed for too long
      const now = Date.now();
      setWords(prev => prev.filter(word => now - word.timestamp < 4000));

      // Add a new word if we have less than maxWords
      if (words.length < maxWords) {
        const phrase = conspiracyPhrases[Math.floor(Math.random() * conspiracyPhrases.length)];
        const x = Math.random() * (window.innerWidth - 200);
        const y = Math.random() * (window.innerHeight - 100);
        const timestamp = Date.now();
        
        const uniqueId = `${timestamp}-${x.toFixed(2)}-${y.toFixed(2)}-${Math.random().toString(36).substr(2, 9)}`;
        
        const newWord: ConspiracyWord = {
          id: uniqueId,
          text: phrase.text,
          color: phrase.color,
          x,
          y,
          timestamp
        };

        setWords(prev => [...prev, newWord]);
      }
    };

    intervalRef.current = setInterval(updateWords, 4000);

    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
      if (!isVisibleRef.current && intervalRef.current) {
        clearInterval(intervalRef.current);
      } else if (isVisibleRef.current) {
        intervalRef.current = setInterval(updateWords, 4000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [words.length]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      <AnimatePresence mode="popLayout">
        {words.map(word => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.95, 1.05, 1.05, 0.95],
              filter: [
                'blur(8px)',
                'blur(0px)',
                'blur(0px)',
                'blur(8px)'
              ]
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: 3,
              times: [0, 0.1, 0.9, 1]
            }}
            className={`absolute font-mono text-sm font-bold tracking-wider ${word.color}`}
            style={{ 
              left: word.x,
              top: word.y,
              textShadow: '0 0 10px currentColor',
            }}
          >
            {word.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}