import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, Loader2, ShieldAlert, CheckCircle2, XCircle, Signal, AlertTriangle, Globe2, Wifi } from 'lucide-react';
import { useAgentStore } from '../store/useAgentStore';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneModal({ isOpen, onClose }: PhoneModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('1'); // Default to US
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [signalStrength, setSignalStrength] = useState(100);
  const [latency, setLatency] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { selectedAgent, startCall, getCallStatus } = useAgentStore();
  const statusCheckInterval = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  const connectionCheckInterval = useRef<NodeJS.Timeout>();

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

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) { // Limit to 4 digits
      setCountryCode(value);
      setError(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('INVALID FREQUENCY: Please enter a valid quantum frequency pattern (XXX-XXX-XXXX)');
      setIsLoading(false);
      setIsLoading(false);
      return;
    }
    if (!countryCode) {
      setError('DIMENSION ERROR: Please specify quantum dimension code');
      setIsLoading(false);
      setIsLoading(false);
      return;
    }
    
    // Ensure country code starts with 1 for US numbers
    const normalizedCountryCode = countryCode === '1' ? '1' : countryCode;
    setCountryCode(normalizedCountryCode);
    
    setShowConfirmation(true);
  }, [phoneNumber, countryCode, setCountryCode]);

  const initiateCall = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setShowSuccess(false);
    setCallStatus(null);
    setShowConfirmation(false);
    
    try {
      if (!selectedAgent) {
        throw new Error('QUANTUM ERROR: No agent consciousness detected');
        setIsLoading(false);
        return;
      }

      // Remove formatting from phone number before sending
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      // Ensure country code starts with 1 for US numbers
      const cleanCountryCode = countryCode === '1' ? '1' : countryCode.replace(/\D/g, '');

      const result = await startCall(cleanPhoneNumber, cleanCountryCode);
      
      if (result.success) {
        setShowSuccess(true);
        // Start polling for call status
        statusCheckInterval.current = setInterval(async () => {
          try {
            const status = await getCallStatus();
            setCallStatus(status);
            
            if (['completed', 'failed', 'busy', 'no-answer', 'canceled'].includes(status)) {
              if (statusCheckInterval.current) {
                clearInterval(statusCheckInterval.current);
                setIsLoading(false);
              }
            }
          } catch (error) {
            console.error('Error checking call status:', error);
            if (statusCheckInterval.current) {
              clearInterval(statusCheckInterval.current);
              setIsLoading(false);
            }
            setError('QUANTUM INTERFERENCE: Unable to verify transmission status');
          }
        }, 2000);

        // Close modal after success
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Call initiation error:', err);
      setError(err instanceof Error ? err.message : 'NEURAL INTERFACE ERROR: Failed to establish quantum connection');
      setIsLoading(false);
    }
  }, [phoneNumber, countryCode, selectedAgent, startCall, getCallStatus, onClose]);

  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setPhoneNumber('');
      setCountryCode('1');
      setError(null);
      setShowConfirmation(false);
      setShowSuccess(false);
      setCallStatus(null);
      setIsLoading(false);
      // Re-enable button after 5 seconds
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 5000);
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    } else {
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Simulate network conditions
  useEffect(() => {
    if (isOpen) {
      connectionCheckInterval.current = setInterval(() => {
        setSignalStrength(prev => {
          const variation = Math.random() * 20 - 10;
          return Math.max(60, Math.min(100, prev + variation));
        });
        setLatency(Math.floor(Math.random() * 50 + 30));
      }, 2000);
    }
    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
      }
    };
  }, [isOpen]);

  const renderCallStatus = () => {
    if (!callStatus) return null;

    const statusConfig = {
      queued: { icon: Loader2, color: 'text-yellow-400', text: 'Call queued...' },
      initiated: { icon: Loader2, color: 'text-yellow-400', text: 'Initiating call...' },
      ringing: { icon: Loader2, color: 'text-blue-400', text: 'Phone is ringing...' },
      'in-progress': { icon: CheckCircle2, color: 'text-green-400', text: 'Call in progress' },
      completed: { icon: CheckCircle2, color: 'text-green-400', text: 'Call completed' },
      failed: { icon: XCircle, color: 'text-red-400', text: 'Call failed' },
      busy: { icon: XCircle, color: 'text-red-400', text: 'Line is busy' },
      'no-answer': { icon: XCircle, color: 'text-red-400', text: 'No answer' },
      canceled: { icon: XCircle, color: 'text-red-400', text: 'Call canceled' }
    };

    const config = statusConfig[callStatus as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-2 ${config.color}`}>
        <Icon size={16} className={config.icon === Loader2 ? 'animate-spin' : ''} />
        <span>{config.text}</span>
      </div>
    );
  };

  if (!selectedAgent) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[100000] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-panel rounded-lg max-w-sm w-full terminal-border relative overflow-hidden z-[100001]"
              >
                {/* CRT Effect Overlay */}
                <div className="absolute inset-0 pointer-events-none crt" />
                
                {/* Header */}
                <div className="p-4 border-b border-[var(--accent-blue)]/20">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[var(--terminal-cyan)]">
                      SECURE CALL INTERFACE
                      <div className="flex items-center gap-1 mt-1">
                        <motion.div
                          className="flex items-center gap-1"
                          animate={{
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                          }}
                        >
                          <Globe2 className="w-4 h-4 text-[var(--terminal-cyan)]/70" />
                          <span className="text-xs text-[var(--terminal-cyan)]/70">
                            {latency}ms
                          </span>
                        </motion.div>
                      </div>
                    </h2>
                    <button
                      onClick={onClose}
                      className="text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <p className="text-[var(--terminal-cyan)]/70 text-sm mt-2">
                    Establishing quantum-encrypted connection with {selectedAgent?.name}
                  </p>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {!showConfirmation ? (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm text-[var(--terminal-cyan)]/70">
                          ENTER CONTACT FREQUENCY
                        </label>
                        <div className="flex gap-2 mb-4">
                          <div className="relative w-24">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-[var(--terminal-cyan)]/50">
                              +
                            </div>
                            <input
                              type="text"
                              value={countryCode}
                              onChange={handleCountryCodeChange}
                              placeholder="1"
                              className="w-full glass-input rounded-lg pl-6 pr-2 py-2 text-[var(--terminal-cyan)] placeholder-[var(--terminal-cyan)]/30 focus:outline-none"
                            />
                          </div>
                          <div className="relative flex-1">
                            <input
                              ref={inputRef}
                              type="text"
                              value={phoneNumber}
                              onChange={handlePhoneNumberChange}
                              placeholder="XXX-XXX-XXXX"
                              className="w-full bg-black/30 border border-[var(--accent-blue)]/30 rounded-lg px-4 py-2 text-[var(--terminal-cyan)] placeholder-[var(--terminal-cyan)]/30 focus:outline-none focus:border-[var(--accent-blue)]/60"
                            />
                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--terminal-cyan)]/30" size={18} />
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-[var(--terminal-cyan)]/50">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                          />
                          <p>ENCRYPTED CHANNEL: ACTIVE</p>
                        </div>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-red-400 text-sm bg-red-950/20 p-3 rounded-lg border border-red-500/20"
                        >
                          <ShieldAlert size={16} />
                          <div className="flex flex-col gap-1">
                            <span>{error}</span>
                            {error.includes('Neural interface not configured') && (
                              <span className="text-xs opacity-70">
                                Please configure BlandAI credentials in your environment variables.
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )}

                      <motion.button
                        layout
                        onClick={handleSubmit}
                        disabled={!phoneNumber || !countryCode || isLoading}
                        className={`w-full py-2 rounded-lg relative overflow-hidden group transition-all duration-200 ${
                          !phoneNumber || !countryCode || isLoading
                            ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]/40 cursor-not-allowed border border-[var(--accent-blue)]/20'
                            : 'bg-[var(--accent-blue)]/20 hover:bg-[var(--accent-blue)]/30 text-[var(--accent-blue)] cursor-pointer border border-[var(--accent-blue)] shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Glowing border effect */}
                        <motion.div
                          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{
                            background: `
                              linear-gradient(90deg, 
                                var(--terminal-cyan) 0%, 
                                transparent 25%,
                                transparent 75%,
                                var(--terminal-cyan) 100%
                              )
                            `
                          }}
                          animate={{
                            x: ['-200%', '200%']
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        {/* Pulsing glow effect */}
                        <motion.div
                          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{
                            boxShadow: '0 0 20px var(--terminal-cyan)',
                          }}
                          animate={{
                            opacity: [0, 0.5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        {/* Button content */}
                        <span className="relative z-10 font-medium tracking-wider">
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                          'INITIATE SECURE CALL'
                        )}
                        </span>
                      </motion.button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center space-y-2">
                        <ShieldAlert size={40} className="mx-auto text-[var(--terminal-cyan)]" />
                        <h3 className="text-lg font-bold text-[var(--terminal-cyan)]">CONFIRM TRANSMISSION</h3>
                        <div className="flex items-center justify-center gap-2 text-yellow-400/70">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">SECURE CONNECTION REQUIRED</span>
                        </div>
                        {showSuccess ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-center gap-2 text-emerald-400">
                              <CheckCircle2 className="w-5 h-5" />
                              <span>Connection Established</span>
                            </div>
                            <p className="text-sm text-[var(--terminal-green)]/70">
                              Secure channel opened with +{countryCode} {phoneNumber}
                            </p>
                            <div className="flex justify-center">
                              <motion.div
                                className="flex items-center gap-1"
                                animate={{
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                <Signal className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-emerald-400">TRANSMITTING</span>
                              </motion.div>
                            </div>
                          </motion.div>
                        ) : (
                          <p className="text-sm text-[var(--terminal-cyan)]/70">
                            Initiating secure connection to +{countryCode} {phoneNumber}
                          </p>
                        )}
                      </div>

                      <div className="text-xs text-[var(--terminal-cyan)]/50 space-y-1">
                        <p>• ESTIMATED WAIT TIME: 30 SECONDS</p>
                        <p>• VOICE SYNTHESIS: READY</p>
                        <p>• NEURAL LINK: STABLE</p>
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          onClick={() => setShowConfirmation(false)}
                          disabled={isLoading || showSuccess}
                          className={`flex-1 py-3 rounded-lg ${
                            isLoading || showSuccess
                              ? 'bg-red-500/10 text-red-400/50 cursor-not-allowed'
                              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <span>ABORTING</span>
                            </div>
                          ) : showSuccess ? (
                            <div className="flex items-center justify-center gap-2">
                              <span>ABORTED</span>
                            </div>
                          ) : (
                            'ABORT'
                          )}
                        </motion.button>
                        <motion.button
                          onClick={initiateCall}
                          disabled={isLoading || showSuccess}
                          className={`flex-1 py-3 rounded-lg ${
                            isLoading || showSuccess
                              ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]/50 cursor-not-allowed' 
                              : 'bg-[var(--accent-blue)]/20 hover:bg-[var(--accent-blue)]/30 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30'
                          }`}
                          whileHover={isLoading || showSuccess ? {} : { scale: 1.02 }}
                          whileTap={isLoading || showSuccess ? {} : { scale: 0.98 }}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>CONNECTING</span>
                            </div>
                          ) : showSuccess ? (
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>CONNECTED</span>
                            </div>
                          ) : (
                            'CONFIRM'
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Connection quality warning */}

                  <AnimatePresence>
                    {callStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-4 left-4 right-4"
                      >
                        {renderCallStatus()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-black/40 border-t border-[var(--terminal-cyan)]/10 text-[10px] text-[var(--terminal-cyan)]/30 flex items-center justify-between backdrop-blur-sm">
                  <div>[CALL MODULE v0.0.1]</div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--terminal-cyan)]/30" />
                    READY
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}