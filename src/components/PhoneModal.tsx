import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, Loader2, ShieldAlert } from 'lucide-react';
import { useAgentStore } from '../store/useAgentStore';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneModal({ isOpen, onClose }: PhoneModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedAgent } = useAgentStore();

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(number);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 12) {
      setPhoneNumber(formatted);
      setError(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number (XXX-XXX-XXXX)');
      return;
    }
    setShowConfirmation(true);
  }, [phoneNumber]);

  const initiateCall = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulated API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with Twilio
      throw new Error('Twilio integration not implemented');
      
    } catch (err) {
      setError('Call service is currently unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  }, [phoneNumber]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 grid place-items-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--terminal-dark)] rounded-lg max-w-md w-full terminal-border relative overflow-hidden mx-4 my-auto"
          >
            {/* CRT Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none crt" />
            
            {/* Header */}
            <div className="p-6 border-b border-[var(--accent-blue)]/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--terminal-green)]">
                  SECURE CALL INTERFACE
                </h2>
                <button
                  onClick={onClose}
                  className="text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-[var(--terminal-green)]/70 text-sm mt-2">
                Establishing quantum-encrypted connection with {selectedAgent?.name}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {!showConfirmation ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm text-[var(--terminal-green)]/70">
                      ENTER CONTACT FREQUENCY
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder="XXX-XXX-XXXX"
                        className="w-full bg-black/30 border border-[var(--accent-blue)]/30 rounded-lg px-4 py-3 text-[var(--terminal-green)] placeholder-[var(--terminal-green)]/30 focus:outline-none focus:border-[var(--accent-blue)]/60"
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--terminal-green)]/30" size={18} />
                    </div>
                  </div>

                  <div className="text-xs text-[var(--terminal-green)]/50 space-y-1">
                    <p>• ENCRYPTED CHANNEL: ACTIVE</p>
                    <p>• QUANTUM INTERFERENCE: MINIMAL</p>
                    <p>• SIGNAL STRENGTH: OPTIMAL</p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm"
                    >
                      <ShieldAlert size={16} />
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    onClick={handleSubmit}
                    disabled={!phoneNumber || isLoading}
                    className={`w-full py-3 rounded-lg relative overflow-hidden ${
                      !phoneNumber || isLoading
                        ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]/40 cursor-not-allowed'
                        : 'bg-[var(--accent-blue)]/20 hover:bg-[var(--accent-blue)]/30 text-[var(--accent-blue)] cursor-pointer'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'INITIATE SECURE CALL'
                    )}
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center space-y-2">
                    <ShieldAlert size={40} className="mx-auto text-[var(--terminal-green)]" />
                    <h3 className="text-lg font-bold text-[var(--terminal-green)]">CONFIRM TRANSMISSION</h3>
                    <p className="text-sm text-[var(--terminal-green)]/70">
                      Initiating secure connection to {phoneNumber}
                    </p>
                  </div>

                  <div className="text-xs text-[var(--terminal-green)]/50 space-y-1">
                    <p>• ESTIMATED WAIT TIME: 30 SECONDS</p>
                    <p>• VOICE SYNTHESIS: READY</p>
                    <p>• NEURAL LINK: STABLE</p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ABORT
                    </motion.button>
                    <motion.button
                      onClick={initiateCall}
                      className="flex-1 py-3 rounded-lg bg-[var(--accent-blue)]/20 hover:bg-[var(--accent-blue)]/30 text-[var(--accent-blue)]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      CONFIRM
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-black/20 text-[10px] text-[var(--terminal-green)]/30 flex items-center justify-between">
              <div>[CALL MODULE v2.1.5]</div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--terminal-green)]/30" />
                READY
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}