import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { useConspiracyStore } from '../store/useConspiracyStore';
import { formatDate } from '../utils/formatDate'; 
import type { ConspiracyConversation } from '../types/conspiracy';

interface PastConversationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PastConversationsModal({ isOpen, onClose }: PastConversationsModalProps) {
  const { pastConversations, loadConversation } = useConspiracyStore();

  const handleConversationClick = (conversation: ConspiracyConversation) => {
    loadConversation(conversation);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl glass-panel rounded-lg p-6 z-50 max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--terminal-cyan)]" />
                <h3 className="text-lg font-bold text-[var(--terminal-cyan)]">
                  PAST CONSPIRACIES
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
              {pastConversations.length === 0 ? (
                <div className="text-center text-[var(--terminal-cyan)]/70 py-8">
                  No past conspiracies found. Generate some theories first!
                </div>
              ) : (
                pastConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-lg p-4 space-y-2 cursor-pointer hover:bg-[var(--terminal-cyan)]/5 transition-colors group"
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-[var(--terminal-cyan)]">
                        {conversation.title}
                      </h4>
                      <div className="text-xs text-[var(--terminal-cyan)]/50">
                        {formatDate(new Date(conversation.createdAt))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--terminal-cyan)]/70">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{conversation.messages.length} messages</span>
                      </div>
                      <button
                        onClick={(event) => {
                          // Implement delete functionality
                          if (event) {
                            event.stopPropagation(); // Prevent triggering conversation load
                          }
                          const newPastConversations = pastConversations.filter(
                            c => c.id !== conversation.id
                          );
                          localStorage.setItem('pastConspiracies', JSON.stringify(newPastConversations));
                          useConspiracyStore.setState({ pastConversations: newPastConversations });
                        }}
                        className="p-1 text-red-400/70 hover:text-red-400 transition-colors rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-[var(--terminal-cyan)]/20">
              <div className="text-xs text-[var(--terminal-cyan)]/50">
                Past conspiracies are stored locally in your browser
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}