import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, User, Share2, Database, Clock } from 'lucide-react';
import { useConspiracyStore } from '../store/useConspiracyStore';
import Banner3D from '../components/Banner3D';
import { formatDate } from '../utils/formatDate';
import PastConversationsModal from '../components/PastConversationsModal';

const MessageBubble = ({ message, isFirst }: { 
  message: { content: string; type: string; timestamp: Date };
  isFirst: boolean;
}) => {
  const isUser = message.type === 'user';
  const store = useConspiracyStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''} max-w-full`}
    >
      {isFirst && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative
          ${isUser ? 'bg-cyan-500/20' : 'bg-[var(--accent-blue)]/20'}`}>
          {isUser ? (
            <User className="w-4 h-4 text-cyan-400" />
          ) : (
            <Bot className="w-4 h-4 text-cyan-400" />
          )}
        </div>
      )}
      {!isFirst && <div className="w-8" />}
      <div className={`group relative max-w-[85%] ${isUser ? 'ml-12' : 'mr-12'}`}>
        {isFirst && (
          <div className={`text-xs font-medium mb-1 ${isUser ? 'text-right text-cyan-400' : 'text-left text-cyan-400'}`}>
            {isUser ? 'TRUTH SEEKER' : 'CONSPIRACY GENERATOR'}
          </div>
        )}
        <div className={`px-3 py-2 rounded-xl break-words relative leading-relaxed shadow-lg text-sm
          ${isUser 
            ? 'bg-[var(--highlight-blue)] text-[var(--terminal-cyan)]' 
            : 'bg-[var(--highlight-blue)] text-[var(--terminal-cyan)]'}`}
        >
          <span className="text-sm whitespace-pre-wrap">{message.content}</span>
          
          {!isUser && (
            <div className="mt-4 pt-4 border-t border-[var(--terminal-cyan)]/10">
              <motion.button
                onClick={() => store.shareToTwitter(message.content)}
                className="mt-4 flex items-center gap-2 text-xs text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
                Share on Twitter
              </motion.button>
            </div>
          )}
        </div>
        <div className={`text-[10px] mt-1 text-[var(--terminal-cyan)]/70 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default function ConspiracyBuilder() {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPastConversations, setShowPastConversations] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const store = useConspiracyStore();
  const { messages, isGenerating, addMessage, generateConspiracy, savePastConversation } = store;

  const examplePrompts = [
    {
      title: "5G NETWORK",
      prompt: "What's the real purpose of 5G networks and their connection to quantum consciousness?"
    },
    {
      title: "CRYPTO ORIGINS",
      prompt: "Who really created Bitcoin and what's their connection to time travel?"
    },
    {
      title: "AI TAKEOVER",
      prompt: "What's the hidden connection between social media algorithms and artificial consciousness?"
    },
    {
      title: "ANCIENT TECH",
      prompt: "What's the true purpose of the pyramids and their quantum computing capabilities?"
    }
  ];

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlePromptSelect = useCallback((prompt: string) => {
    setInput(prompt);
    setSelectedPrompt(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: messages.length <= 1 ? 'auto' : 'smooth'
        });
      }
    };
    
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isGenerating) return;

    const trimmedInput = input.trim();
    setInput('');
    focusInput();

    try {
      await addMessage({
        content: trimmedInput,
        type: 'user'
      });

      await generateConspiracy(trimmedInput);
      
      // Save conversation after generating response
      savePastConversation();
    } catch (error) {
      console.error('Error:', error);
      await addMessage({
        content: 'ERROR: Neural interface disrupted. Please try again.',
        type: 'system'
      });
    }
  }, [input, isGenerating, addMessage, generateConspiracy, focusInput]);

  const groupedMessages = messages.reduce((groups: { [key: string]: typeof messages }, message) => {
    const date = message.timestamp.toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 relative overflow-y-auto">
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
                <span>CONSPIRACY</span>
                <span className="block sm:inline sm:ml-4">BUILDER</span>
              </motion.span>
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto w-full mb-8">
        {/* Fixed Header */}
        <div className="flex items-center justify-between mb-2 p-3 glass-panel rounded-lg sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1">
            <Database className="w-6 h-6 text-[var(--terminal-cyan)]" />
            <h1 className="text-xl font-bold text-[var(--terminal-cyan)]">
              CONSPIRACY BUILDER
            </h1>
            <motion.button
              onClick={() => setShowPastConversations(true)}
              className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] hover:bg-[var(--terminal-cyan)]/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Clock className="w-4 h-4" />
              Past Conspiracies
            </motion.button>
            <div className="ml-auto flex items-center gap-2 text-xs text-[var(--terminal-cyan)]/70">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span>
                {isGenerating ? 'GENERATING...' : 'READY'}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="relative z-10 glass-panel rounded-lg overflow-hidden flex flex-col h-[calc(100vh-20rem)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-500/20">
            <AnimatePresence mode="sync">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="mb-6">
                  <div className="sticky top-0 bg-cyan-950/90 backdrop-blur-sm py-1 px-2 rounded-lg mb-2 z-[7] border border-[var(--separator-green)] shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                    <div className="text-xs text-cyan-500/70 font-mono">
                      {formatDate(new Date(date))}
                    </div>
                  </div>
                  {dateMessages.map((message, index) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isFirst={index === 0 || dateMessages[index - 1].type !== message.type}
                    />
                  ))}
                </div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[var(--terminal-cyan)]/20 bg-black/40 sticky bottom-0 z-20">
            {/* Example Prompts */}
            <div className="text-sm text-[var(--terminal-cyan)] mb-2">Example Conspiracies</div>
            <div className="text-xs text-[var(--terminal-cyan)]/70 mb-3">Try one of ours:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {examplePrompts.map((example) => (
                <motion.button
                  key={example.title}
                  onClick={() => handlePromptSelect(example.prompt)}
                  className={`p-2 rounded-lg text-xs border backdrop-blur-md transition-all duration-200 ${
                    selectedPrompt === example.prompt
                      ? 'bg-[var(--terminal-cyan)]/20 border-[var(--terminal-cyan)] text-[var(--terminal-cyan)] shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                      : 'bg-black/30 border-[var(--terminal-cyan)]/30 text-[var(--terminal-cyan)]/70 hover:bg-[var(--terminal-cyan)]/10 hover:border-[var(--terminal-cyan)]/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {example.title}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2 mb-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleSend()}
                placeholder="Enter a topic to generate a conspiracy theory..."
                className="flex-1 bg-black/30 border border-[var(--terminal-cyan)]/30 rounded-lg px-4 py-2 text-[var(--terminal-cyan)] placeholder-[var(--terminal-cyan)]/30 focus:outline-none focus:border-[var(--terminal-cyan)]/60"
                disabled={isGenerating}
              />
              <motion.button
                onClick={handleSend}
                disabled={isGenerating || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isGenerating || !input.trim()
                    ? 'bg-[var(--terminal-cyan)]/5 text-[var(--terminal-cyan)]/30 cursor-not-allowed'
                    : 'bg-[var(--terminal-cyan)]/10 hover:bg-[var(--terminal-cyan)]/20 text-[var(--terminal-cyan)]'
                }`}
              >
                {isGenerating ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </motion.button>
            </div>
            <div className="mt-2 text-xs text-[var(--terminal-cyan)]/50">
              {isGenerating ? (
                'ANALYZING QUANTUM DATA PATTERNS...'
              ) : (
                'Enter a topic or keyword to generate a conspiracy theory'
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Generating Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-black/80 rounded-lg p-8 flex flex-col items-center gap-4 border border-[var(--terminal-cyan)]/30"
            >
              <Loader2 className="w-12 h-12 text-[var(--terminal-cyan)] animate-spin" />
              <div className="text-[var(--terminal-cyan)] font-bold">GENERATING CONSPIRACY</div>
              <div className="text-[var(--terminal-cyan)]/70 text-sm text-center max-w-sm">
                Analyzing quantum data patterns and connecting hidden threads...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <PastConversationsModal
        isOpen={showPastConversations}
        onClose={() => setShowPastConversations(false)}
      />
    </div>
  );
}