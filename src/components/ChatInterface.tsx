import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Send, Phone, PhoneOff, Loader2, Bot, User } from 'lucide-react';
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
          ${isUser ? 'bg-cyan-500/20' : message.content.includes('[AGENT PROFILE]') ? 'bg-[var(--accent-blue)]/20' : 'bg-emerald-500/20'}`}>
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
                  className="absolute inset-0 rounded-full border border-[var(--terminal-green)]/30"
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
              <Bot className="w-4 h-4 text-emerald-400" />
            )
          )}
        </div>
      )}
      {!isFirst && <div className="w-8" />}
      <div className={`group relative max-w-[min(280px,80%)] ${isUser ? 'ml-12' : 'mr-12'} ${
        message.content.includes('[AGENT PROFILE]') ? 'w-full' : ''
      }`} style={{ maxWidth: message.content.includes('[AGENT PROFILE]') ? '100%' : '85%' }}>
        {isFirst && (
          <div className={`text-xs font-medium mb-1 ${isUser ? 'text-right text-cyan-400' : 'text-left text-emerald-400'}`}>
            {isUser ? 'USER' : selectedAgent?.name.toUpperCase()}
          </div>
        )}
        <div className={`px-3 py-2 rounded-xl break-words relative leading-relaxed shadow-lg text-sm
          ${isUser 
            ? 'bg-[var(--highlight-blue)] text-gray-900' 
            : message.content.includes('[AGENT PROFILE]')
              ? 'bg-[var(--highlight-blue)] text-gray-900 font-mono whitespace-pre-wrap'
              : 'bg-[var(--highlight-blue)] text-gray-900'}`}
        >
          <span className="text-sm">{message.content}</span>
        </div>
        <div className={`text-[10px] mt-1 text-[var(--terminal-green)]/70 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default function ChatInterface() {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseTimerRef = useRef<number>(0);
  const responseIntervalRef = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectedAgent, messages, addMessage, isCallActive, startCall, endCall, loadChatHistory } = useAgentStore();

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
  }, [messages, selectedAgent]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !selectedAgent || isInputDisabled) return;

    // Clear input and show typing state immediately
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

    const userMessage = {
      id: crypto.randomUUID(),
      agentId: selectedAgent.id,
      content: trimmedInput,
      timestamp: new Date(),
      type: 'user'
    };

    try {
      await addMessage(userMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setInput(trimmedInput); // Restore input on error
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
    <div className="flex flex-col h-full bg-[var(--terminal-dark)]/95 rounded-lg backdrop-blur-sm terminal-border relative font-mono z-[5] crt">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQgPSJNMzAgMzBMNjAgNjBIMHoiIGZpbGw9IiMwMGZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPgo8L3N2Zz4=')] opacity-5" />
      
      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border-b border-[var(--separator-green)] relative z-[7]">
        <div>
          <h3 className="text-sm font-bold text-[var(--terminal-green)] flex items-center gap-2 uppercase">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[var(--terminal-green)]"
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
            {selectedAgent.name}
          </h3>
          <div className="hidden md:flex items-center gap-2 mt-1">
            <p className="text-xs text-[var(--terminal-green)]/70">PROJECT X v0.0.1</p>
            <span className="text-xs text-[var(--terminal-green)]/70">•</span>
            <p className="text-xs text-[var(--terminal-green)]/70">{messages.length} MESSAGES</p>
          </div>
        </div>
        <button
          onClick={() => setIsPhoneModalOpen(true)}
          className={`p-2 rounded-lg relative group ${
            isCallActive 
              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400/90 ring-1 ring-red-500/30' 
              : 'bg-[var(--accent-blue)]/10 hover:bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] ring-1 ring-[var(--accent-blue)]/30'
          }`}
        >
          <motion.div
            className="absolute inset-0 rounded-lg ring-2 ring-[var(--accent-blue)]/30"
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
          {isCallActive ? <PhoneOff size={20} /> : <Phone size={20} />}
        </button>
        <PhoneModal 
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-500/20 text-xs leading-5 relative min-h-0 z-[6]">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-[8]" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-[8]" />
        <AnimatePresence mode="wait">
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

      <div className="p-2 border-t border-[var(--separator-green)] bg-gradient-to-r from-cyan-950/30 to-blue-950/30 relative z-[7]">
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-2 flex items-center gap-2 text-emerald-400/70"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating response...</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div 
          className="flex gap-2 items-center bg-gradient-to-r from-[var(--accent-blue)]/5 to-[var(--accent-blue)]/10 rounded-lg p-2 relative"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => !isInputDisabled && setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && !isInputDisabled && handleSend()}
            placeholder={`Message ${selectedAgent.name}...`}
            disabled={isInputDisabled}
            className={`flex-1 bg-transparent text-cyan-100 px-2 py-2 focus:outline-none border-none rounded-lg
              text-sm caret-cyan-400 placeholder-cyan-500/50 transition-opacity duration-200
              ${isInputDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
          />
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-0 right-0 text-center text-red-400 text-sm"
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
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isInputDisabled || !input.trim()
                ? 'bg-cyan-500/5 text-cyan-400/30 cursor-not-allowed text-sm'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400/90 text-sm'
            }`}
          >
            <Send size={16} />
          </motion.button>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--separator-green)]/70">
          <div>[TERMINAL v0.0.1] [ENCRYPTION: AES-256] [STATUS: SECURE]</div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isInputDisabled ? 'bg-[var(--separator-green)] animate-pulse' : 'bg-[var(--separator-green)]'}`} />
            {isInputDisabled ? 'PROCESSING' : 'READY'}
          </div>
        </div>
      </div>
    </div>
  );
}