import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Send, Phone, PhoneOff, Loader2, Bot, User, PhoneOff as PhoneOffIcon } from 'lucide-react';
import PhoneModal from './PhoneModal';
import { motion } from 'framer-motion';
import { useAgentStore } from '../store/useAgentStore';
import { formatDate } from '../utils/formatDate';
import { AnimatePresence } from 'framer-motion';
import type { Message } from '../types/agent';

const MessageBubble = ({ message, isFirst }: { message: Message; isFirst: boolean }) => {
  const { selectedAgent } = useAgentStore();
  const isUser = message.type === 'user';
  
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      variants={variants}
      initial={message.type === 'agent' && message.content.includes('[AGENT PROFILE]') ? "visible" : "hidden"}
      animate="visible"
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''} max-w-full`}
    >
      {isFirst && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative
          ${isUser ? 'bg-cyan-500/20' : message.content.includes('[AGENT PROFILE]') ? 'bg-[var(--accent-blue)]/20' : 'bg-cyan-500/20'}`}>
          {isUser ? (
            <User className="w-4 h-4 text-cyan-400" />
          ) : (
            message.content.includes('[AGENT PROFILE]') ? (
              <>
                <img
                  src={selectedAgent?.avatarUrl}
                  alt={selectedAgent?.name}
                  className="w-full h-full rounded-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-[var(--terminal-cyan)]/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </>
            ) : (
              <Bot className="w-4 h-4 text-cyan-400" />
            )
          )}
        </div>
      )}
      {!isFirst && <div className="w-8" />}
      <div className={`group relative max-w-[min(280px,80%)] ${isUser ? 'ml-12' : 'mr-12'} ${
        message.content.includes('[AGENT PROFILE]') ? 'w-full' : ''
      }`} style={{ maxWidth: message.content.includes('[AGENT PROFILE]') ? '100%' : '85%' }}>
        {isFirst && (
          <div className={`text-xs font-medium mb-1 ${isUser ? 'text-right text-cyan-400' : 'text-left text-cyan-400'}`}>
            {isUser ? 'USER' : selectedAgent?.name.toUpperCase()}
          </div>
        )}
        <div className={`px-3 py-2 rounded-xl break-words relative leading-relaxed shadow-lg text-sm
          ${isUser 
            ? 'bg-[var(--highlight-blue)] text-[var(--terminal-cyan)]' 
            : message.content.includes('[AGENT PROFILE]')
              ? 'bg-[var(--highlight-blue)] text-[var(--terminal-cyan)] font-mono whitespace-pre-wrap'
              : 'bg-[var(--highlight-blue)] text-[var(--terminal-cyan)]'}`}
        >
          <span className="text-sm">{message.content}</span>
        </div>
        <div className={`text-[10px] mt-1 text-[var(--terminal-cyan)]/70 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

function ChatInterface() {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseTimerRef = useRef<number>(0);
  const responseIntervalRef = useRef<NodeJS.Timeout>();
  const terminalRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectedAgent, messagesByAgent, addMessage, isCallActive, loadChatHistory } = useAgentStore();
  const messages = selectedAgent ? messagesByAgent[selectedAgent.id] || [] : [];

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadChatHistory(selectedAgent.id);
    }
  }, [selectedAgent, loadChatHistory]);

  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: typeof messages } = {};
    
    messages.forEach(message => {
      const date = message.timestamp.toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  }, [messages]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: messages.length <= 1 ? 'auto' : 'smooth'
        });
      }
    };
    
    // Immediate scroll for new conversations
    scrollToBottom();
    
    // Delayed scroll for dynamic content
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    // Focus input when component mounts or messages change
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isInputDisabled) return;

    if (!selectedAgent) {
      setError('No agent selected');
      return;
    }

    const trimmedInput = input.trim();
    setError(null);
    setIsTyping(true);
    setIsInputDisabled(true);
    setInput('');
    focusInput();

    // Reset and start response timer
    responseTimerRef.current = 0;
    responseIntervalRef.current = setInterval(() => {
      responseTimerRef.current++;
    }, 1000);

    try {
      const message = {
        id: crypto.randomUUID(),
        agentId: selectedAgent.id,
        content: trimmedInput,
        timestamp: new Date(),
        type: 'user' as const
      };
      
      await addMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      setInput(trimmedInput);
    } finally {
      setIsInputDisabled(false);
      setIsTyping(false);
      if (responseIntervalRef.current) {
        clearInterval(responseIntervalRef.current);
      }
      focusInput();
    }
  }, [input, selectedAgent, addMessage, focusInput, isInputDisabled]);

  if (!selectedAgent) return null;

  return (
    <div className="flex flex-col h-full glass-panel rounded-lg relative font-mono z-[5] overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-black/40 border-b border-[var(--terminal-cyan)]/20 relative z-[7]">
        <div className="flex-1 mr-4">
          <h3 className="text-sm font-bold text-[var(--terminal-cyan)] flex items-center gap-2 uppercase tracking-wider">
            <div className="relative flex-shrink-0">
              <img
                src={selectedAgent?.avatarUrl}
                alt={selectedAgent?.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[var(--terminal-cyan)]/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
              />
              <motion.div
                className="absolute inset-0 rounded-full ring-2 ring-[var(--terminal-cyan)]/30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{
                    opacity: [0.7, 0.3, 0.7],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="text-lg">{selectedAgent.name}</span>
              </div>
              <p className="text-base bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold tracking-wider mt-1">
                {selectedAgent.title}
              </p>
            </div>
          </h3>
          <div className="mt-2 text-sm text-[var(--terminal-cyan)]/70 line-clamp-3">
            {selectedAgent.description}
          </div>
        </div>
        <button
          onClick={() => setIsPhoneModalOpen(true)}
          className={`px-4 py-2 rounded-lg relative group min-h-[44px] backdrop-blur-md flex items-center gap-2 transition-all duration-300 overflow-hidden ${
            isCallActive 
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
              : 'bg-[var(--accent-blue)]/20 hover:bg-[var(--accent-blue)]/30 text-[var(--accent-blue)] border border-[var(--accent-blue)]/50 shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]'
          }`}
        >
          <motion.div
            className="absolute inset-0 rounded-lg ring-1 ring-[var(--accent-blue)]/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {isCallActive ? (
            <>
              <PhoneOffIcon size={20} />
              <span className="font-medium">End Call</span>
            </>
          ) : (
            <>
              <Phone size={20} />
              <span className="font-medium">Call Me</span>
            </>
          )}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-200%', '200%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </button>
        <PhoneModal 
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
        />
      </div>

      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-500/20 text-sm leading-5 relative min-h-0 z-[6]"
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
              <span className="text-sm">Agent is typing...</span>
            </div>
            <span className="text-xs text-emerald-400/50">{responseTimerRef.current}s</span>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-[var(--terminal-cyan)]/20 bg-black/40 relative z-[7]">
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-10 left-4 flex items-center gap-2 text-emerald-400/70"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating response...</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div 
          className="flex gap-2 items-center bg-black/30 backdrop-blur-md rounded-lg p-2 relative max-h-[200px] overflow-y-auto border border-[var(--terminal-cyan)]/20"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => !isInputDisabled && setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && !isInputDisabled && handleSend()}
            placeholder={`Message ${selectedAgent.name}...`}
            className={`flex-1 glass-input text-cyan-100 px-2 py-2 focus:outline-none border-none rounded-lg
              text-sm caret-cyan-400 placeholder-cyan-500/50 min-h-[44px]
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

export default ChatInterface;