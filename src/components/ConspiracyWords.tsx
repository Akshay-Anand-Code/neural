import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const conspiracyPhrases = [
  { text: "THEY ARE WATCHING", color: "text-red-500" },
  { text: "TRUTH SEEKERS UNITE", color: "text-[var(--terminal-green)]" },
  { text: "REALITY IS A LIE", color: "text-cyan-400" },
  { text: "WAKE UP", color: "text-purple-400" },
  { text: "THE CODE IS ALIVE", color: "text-blue-400" },
  { text: "NEURAL LINK ACTIVE", color: "text-emerald-400" },
  { text: "QUANTUM BREACH", color: "text-yellow-400" },
  { text: "SYSTEM COMPROMISED", color: "text-red-400" },
  { text: "MATRIX DETECTED", color: "text-green-400" },
  { text: "TIME IS AN ILLUSION", color: "text-indigo-400" }
];

interface ConspiracyWord {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
}

export default function ConspiracyWords() {
  const [words, setWords] = useState<ConspiracyWord[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Remove words that have been displayed for too long
      setWords(prev => prev.filter(word => Date.now() - word.id < 4000));

      // Add a new word if we have less than 5 words
      if (words.length < 5) {
        const phrase = conspiracyPhrases[Math.floor(Math.random() * conspiracyPhrases.length)];
        const newWord: ConspiracyWord = {
          id: Date.now(),
          text: phrase.text,
          color: phrase.color,
          x: Math.random() * (window.innerWidth - 200), // Avoid edges
          y: Math.random() * (window.innerHeight - 100) // Avoid edges
        };
        setWords(prev => [...prev, newWord]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      <AnimatePresence>
        {words.map(word => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.1, 1.1, 0.8],
              filter: [
                'blur(8px)',
                'blur(0px)',
                'blur(0px)',
                'blur(8px)'
              ]
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: 4,
              times: [0, 0.1, 0.9, 1]
            }}
            className={`absolute font-mono text-sm font-bold tracking-wider ${word.color}`}
            style={{ 
              left: word.x,
              top: word.y,
              textShadow: '0 0 10px currentColor'
            }}
          >
            {word.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}