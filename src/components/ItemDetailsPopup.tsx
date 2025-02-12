import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Info, Shield } from 'lucide-react';
import type { InventoryItem } from '../types/rpg';
import { useRPGStore } from '../store/useRPGStore';

interface ItemDetailsPopupProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function ItemDetailsPopup({ item, onClose }: ItemDetailsPopupProps) {
  if (!item) return null;
  
  const { equippedItems, equipItem, unequipItem } = useRPGStore();
  const isEquipped = item.equipped;
  const canEquipMore = equippedItems.length < 5;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      />

      <motion.div
        key="modal-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md glass-panel rounded-lg p-6 z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[var(--terminal-cyan)]" />
            <h3 className="text-lg font-bold text-[var(--terminal-cyan)] flex items-center gap-2">
              {item.name}
              <Award className={`w-4 h-4 ${
                item.rarity === 'legendary' ? 'text-yellow-400' :
                item.rarity === 'rare' ? 'text-blue-400' :
                'text-gray-400'
              }`} />
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
        <div className="space-y-4">
          <div>
            <div className="text-sm text-[var(--terminal-cyan)]/70 mb-1">
              DESCRIPTION
            </div>
            <p className="text-sm text-[var(--terminal-cyan)]">
              {item.description}
            </p>
          </div>

          <div>
            <div className="text-sm text-[var(--terminal-cyan)]/70 mb-1">
              TYPE
            </div>
            <div className="text-sm text-[var(--terminal-cyan)] capitalize">
              {item.type}
            </div>
          </div>

          <div>
            <div className="text-sm text-[var(--terminal-cyan)]/70 mb-1">
              EFFECTS
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(item.effects).map(([stat, value]) => (
                <div
                  key={stat}
                  className="text-sm flex items-center justify-between p-2 glass-panel rounded-lg"
                >
                  <span className="text-[var(--terminal-cyan)]/70 capitalize">
                    {stat}
                  </span>
                  <span className={value >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {value >= 0 ? '+' : ''}{value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-[var(--terminal-cyan)]/70 mb-1">
              RARITY
            </div>
            <div className={`text-sm capitalize ${
              item.rarity === 'legendary' ? 'text-yellow-400' :
              item.rarity === 'rare' ? 'text-blue-400' :
              'text-gray-400'
            }`}>
              {item.rarity}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-2">
          <motion.button
            onClick={onClose}
            className="py-2 px-4 rounded-lg glass-button text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
          
          <div className="text-xs text-[var(--terminal-cyan)]/50 flex items-center px-2">
            <Shield className="w-4 h-4 mr-1" />
            {equippedItems.length}/5 equipped
          </div>
          
          <motion.button
            onClick={() => isEquipped ? unequipItem(item.id) : equipItem(item.id)}
            disabled={!isEquipped && !canEquipMore}
            className={`flex-1 py-2 rounded-lg ${
              isEquipped
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                : !canEquipMore
                ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed'
                : 'glass-panel text-[var(--terminal-cyan)] border-[var(--terminal-cyan)]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isEquipped ? 'Unequip' : 'Equip'}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}