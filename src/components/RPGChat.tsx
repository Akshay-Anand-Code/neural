import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRPGStore } from '../store/useRPGStore';
import { venice } from '../utils/venice';
import { formatDate } from '../utils/formatDate';
import type { RPGMessage, GameChoice } from '../types/rpg';

const MessageBubble = ({ message, isFirst }: { message: RPGMessage; isFirst: boolean }) => {
  const [username] = useState(() => localStorage.getItem('rpg_username') || 'Anonymous User');
  const isUser = message.type === 'user';
  
  const handleChoice = async (choice: GameChoice) => {
    const { makeChoice } = useRPGStore.getState();
    await makeChoice(choice);
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
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
            {isUser ? username.toUpperCase() : 'DUNGEON MASTER'}
          </div>
        )}
        <div className={`px-3 py-2 rounded-xl break-words relative leading-relaxed shadow-lg text-sm
          ${isUser 
            ? 'bg-[var(--highlight-blue)] text-[var(--terminal-cyan)]' 
            : 'bg-[var(--highlight-blue)] text-[var(--terminal-cyan)]'}`}
        >
          <span className="text-sm whitespace-pre-wrap">{message.content}</span>
          
          {message.choices && message.choices.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-[var(--terminal-cyan)]/10 pt-2">
              {message.choices.map((choice, index) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left px-2 py-1.5 rounded bg-[var(--terminal-cyan)]/10 hover:bg-[var(--terminal-cyan)]/20 transition-colors text-sm"
                >
                  {index + 1}. {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={`text-[10px] mt-1 text-[var(--terminal-cyan)]/70 ${isUser ? 'text-right' : 'text-left'}`}>
          {(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

function RPGChat() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const responseTimerRef = useRef<NodeJS.Timeout>();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    messages,
    addMessage,
    makeChoice
  } = useRPGStore();

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        const container = chatContainerRef.current;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: messages.length <= 1 ? 'auto' : 'smooth'
          });
        }
      }
    };
    
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleGameChoice = useCallback(async (choice: GameChoice) => {
    setIsInputDisabled(true);
    const success = await makeChoice(choice);
    setIsInputDisabled(false);
    return success;
  }, [makeChoice]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isInputDisabled) return;

    // Store input in case we need to restore it on error
    const trimmedInput = input.trim();
    setError(null);
    setIsTyping(true);
    setIsInputDisabled(true);
    setInput('');
    setResponseTime(null);
    focusInput();

    if (responseTimerRef.current) {
      clearInterval(responseTimerRef.current);
    }

    responseTimerRef.current = setInterval(() => {
      setResponseTime(prev => (prev ?? 0) + 1);
    }, 1000);

    try {
      await addMessage({
        content: trimmedInput,
        type: 'user',
        choices: []
      });
      
      try {
        // Get response from Venice AI
        const response = await venice.chatWithRPG(trimmedInput, {
          systemPrompt: 'You are an AI Dungeon Master guiding players through a cyberpunk quantum RPG adventure.',
          playerState: {
            level: useRPGStore.getState().level,
            skills: useRPGStore.getState().skills,
            inventory: useRPGStore.getState().inventory,
            activeQuests: useRPGStore.getState().activeQuests
          }
        });
        
        // Add AI response
        await addMessage({
          content: response,
          type: 'system',
          choices: []
        });
      } catch (veniceError) {
        console.error('Venice API error:', veniceError);
        await addMessage({
          content: '*NEURAL INTERFACE ERROR* Unable to process request. Please check your API configuration.',
          type: 'system',
          choices: []
        });
      }

    } catch (error) {
      console.error('Error processing message:', error instanceof Error ? error.message : error);
      setError(error instanceof Error ? error.message : 'Neural interface disrupted. Please try again.');
      setInput(trimmedInput);
    } finally {
      if (responseTimerRef.current) {
        clearInterval(responseTimerRef.current);
      }
      setIsInputDisabled(false);
      setIsTyping(false);
      setResponseTime(null);
      focusInput();
    }
  }, [input, isInputDisabled, addMessage, focusInput]);

  useEffect(() => {
    return () => {
      if (responseTimerRef.current) {
        clearInterval(responseTimerRef.current);
        setResponseTime(null);
      }
    };
  }, []);

  const groupedMessages = messages.reduce((groups: { [key: string]: RPGMessage[] }, message) => {
    const date = (message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-lg backdrop-blur-md border border-[var(--terminal-cyan)]/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative font-mono z-[5] overflow-hidden">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-500/20 text-sm leading-5 relative z-[6]"
      >
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-[8]" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-[8]" />
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
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-emerald-400/70 pl-12 justify-between"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Dungeon Master is typing...</span>
            </div>
            {responseTime !== null && (
              <span className="text-xs text-emerald-400/50">{responseTime}s</span>
            )}
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-[var(--terminal-cyan)]/20 bg-black/40 relative z-[7]">
        
        <div 
          className="flex gap-2 items-center bg-black/30 backdrop-blur-md rounded-lg p-2 relative border border-[var(--terminal-cyan)]/20"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => !isInputDisabled && setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && !isInputDisabled && handleSend()}
            placeholder="Chat with the AI Dungeon Master..."
            autoComplete="off"
            spellCheck="false"
            className={`flex-1 bg-transparent text-cyan-100 px-2 py-2 focus:outline-none border-none rounded-lg
              text-sm caret-cyan-400 placeholder-cyan-500/50 transition-opacity duration-200 min-h-[44px]
              ${isInputDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
          />
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-10 left-0 right-0 text-center text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
          <motion.button
            onClick={handleSend}
            disabled={isInputDisabled || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`p-2 rounded-lg transition-colors duration-200 backdrop-blur-md ${
              isInputDisabled || !input.trim()
                ? 'bg-cyan-500/5 text-cyan-400/30 cursor-not-allowed text-sm'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400/90 text-sm'
            }`}
          >
            <Send size={16} />
          </motion.button>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--terminal-cyan)]/50">
          <div>[NEURAL.SYS v0.0.1] [<span className="text-red-400 dark:text-cyan-400">ENCRYPTED</span>] [STATUS: <motion.span
            className="relative"
            animate={{
              textShadow: [
                '0 0 4px var(--glow-color-rgb)',
                '0 0 8px var(--glow-color-rgb)',
                '0 0 4px var(--glow-color-rgb)'
              ],
              color: [
                'var(--glow-color)',
                'var(--glow-color-dim)',
                'var(--glow-color)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ACTIVE
          </motion.span>]</div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isInputDisabled ? 'bg-[var(--terminal-cyan)] animate-pulse' : 'bg-[var(--terminal-cyan)]'}`} />
            {isInputDisabled ? 'PROCESSING' : 'READY'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RPGChat;