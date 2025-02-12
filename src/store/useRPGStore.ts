import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RPGState, Quest, InventoryItem, GameChoice, RPGMessage } from '../types/rpg';

const INITIAL_STATE: RPGState = {
  level: 1,
  experience: 0,
  messages: [
    {
      id: crypto.randomUUID(),
      content: `Welcome, initiate. I am your guide through the quantum neural network, a realm where the boundaries of reality are bent and twisted by the power of quantum computing. Your journey begins in the heart of the network, where the whispers of the code await your attention.

You find yourself in a virtual realm, surrounded by the hum of machinery and the glow of neon lights. The air is thick with the scent of ozone and burned circuitry. Your mission, as outlined in your active quest, "Neural Network Initiation," is to breach a system using your Quantum Hacking Device.

You have the following items in your inventory:
1. Quantum Hacking Device - A sophisticated tool for breaching quantum-encrypted systems, granting you +2 hacking and +1 quantum capabilities.

Your current skills are:
1. hacking - 1
2. encryption - 1
3. analysis - 1
4. quantum - 1

To proceed, you can use the following commands:
/hack - Attempt to breach a system
/scan - Analyze neural patterns
/use [item] - Use an inventory item
/status - Check current stats
/help - List available commands

What would you like to do first, initiate? Will you attempt to /hack the tutorial-node, /scan the surrounding neural patterns, or /use your Quantum Hacking Device to prepare for the challenge ahead? The choice is yours.`,
      type: 'system',
      timestamp: new Date(),
      choices: []
    }
  ],
  equippedItems: [],
  skills: {
    hacking: 1,
    encryption: 1,
    analysis: 1,
    quantum: 1
  },
  inventory: [
    {
      id: 'quantum-hacker',
      name: 'Quantum Hacking Device',
      description: 'A sophisticated tool for breaching quantum-encrypted systems',
      type: 'tool',
      rarity: 'rare',
      effects: {
        hacking: 2,
        quantum: 1
      }
    }
  ],
  completedQuests: [],
  activeQuests: [
    {
      id: 'tutorial',
      title: 'NEURAL NETWORK INITIATION',
      description: 'Complete your initial training in the quantum neural network',
      status: 'active',
      objectives: [
        {
          id: 'first-hack',
          description: 'Breach the tutorial-node using your Quantum Hacking Device',
          completed: false,
          type: 'hack',
          target: 'tutorial-node',
          progress: 0,
          required: 1
        }
      ],
      rewards: {
        experience: 100,
        reputation: 10
      }
    }
  ],
  reputation: 0,
  lastSaved: new Date().toISOString()
};

interface RPGStore extends RPGState {
  messages: RPGMessage[];
  addMessage: (message: Omit<RPGMessage, 'id' | 'timestamp'>) => void;
  makeChoice: (choice: GameChoice) => Promise<boolean>;
  addExperience: (amount: number) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  startQuest: (quest: Quest) => void;
  completeQuest: (questId: string) => void;
  updateSkill: (skill: keyof RPGState['skills'], amount: number) => void;
  resetProgress: () => void;
}

export const useRPGStore = create<RPGStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      messages: [],

      addMessage: (message) => {
        if (!message.content?.trim()) {
          console.error('Empty message content');
          return Promise.resolve();
        }

        set(state => ({
          messages: [...state.messages, {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            ...message
          }]
        }));

        // Return success to allow error handling in components
        return Promise.resolve();
      },

      makeChoice: async (choice: GameChoice) => {
        const state = get();
        let success = true;

        try {
          // Check requirements
          if (choice.requirements) {
            if (choice.requirements.skills) {
              for (const [skill, required] of Object.entries(choice.requirements.skills)) {
                if (state.skills[skill as keyof RPGState['skills']] < required) {
                  success = false;
                  break;
                }
              }
            }

            if (choice.requirements.items) {
              for (const itemId of choice.requirements.items) {
                if (!state.inventory.find(item => item.id === itemId)) {
                  success = false;
                  break;
                }
              }
            }

            if (choice.requirements.reputation && state.reputation < choice.requirements.reputation) {
              success = false;
            }
          }

          // Apply outcome effects
          const outcome = success ? choice.consequences.success : choice.consequences.failure;
          if (outcome) {
            const effects = outcome.effects;
            
            if (effects.experience) {
              get().addExperience(effects.experience);
            }
            
            if (effects.reputation) {
              set(state => ({ reputation: state.reputation + (effects.reputation || 0) }));
            }
            
            if (effects.items) {
              if (effects.items.add) {
                effects.items.add.forEach(item => get().addItem(item));
              }
              if (effects.items.remove) {
                effects.items.remove.forEach(itemId => get().removeItem(itemId));
              }
            }
            
            if (effects.skills) {
              Object.entries(effects.skills).forEach(([skill, amount]) => {
                get().updateSkill(skill as keyof RPGState['skills'], amount);
              });
            }
            
            if (effects.quests) {
              if (effects.quests.add) {
                effects.quests.add.forEach(quest => get().startQuest(quest));
              }
              if (effects.quests.complete) {
                effects.quests.complete.forEach(questId => get().completeQuest(questId));
              }
              if (effects.quests.fail) {
                effects.quests.fail.forEach(questId => {
                  set(state => ({
                    activeQuests: state.activeQuests.filter(q => q.id !== questId)
                  }));
                });
              }
            }
          }

          // Add outcome message
          get().addMessage({
            content: outcome?.text || (success ? 'Action successful' : 'Action failed'),
            type: 'system'
          });

          set({ lastSaved: new Date().toISOString() });
          return success;
        } catch (error) {
          console.error('Error in makeChoice:', error instanceof Error ? error.message : error);
          get().addMessage({
            content: '*NEURAL INTERFACE ERROR* Failed to process choice. Please try again.',
            type: 'system'
          });
          return false;
        }
      },

      addExperience: (amount: number) => {
        set(state => {
          const newExp = state.experience + amount;
          const newLevel = Math.floor(Math.sqrt(newExp / 100)) + 1;
          
          if (newLevel > state.level) {
            get().addMessage({
              content: `LEVEL UP! You are now level ${newLevel}`,
              type: 'system'
            });
          }
          
          return {
            experience: newExp,
            level: newLevel
          };
        });
      },

      addItem: (item: InventoryItem) => {
        set(state => ({
          inventory: [...state.inventory, item]
        }));
        get().addMessage({
          content: `Acquired: ${item.name}`,
          type: 'system'
        });
      },

      equipItem: (itemId: string) => {
        set(state => {
          // Check if we can equip more items
          if (state.equippedItems.length >= 5) {
            get().addMessage({
              content: 'EQUIPMENT ERROR: Maximum of 5 items can be equipped',
              type: 'system'
            });
            return state;
          }

          return {
            equippedItems: [...state.equippedItems, itemId],
            inventory: state.inventory.map(item => 
              item.id === itemId ? { ...item, equipped: true } : item
            )
          };
        });
      },

      unequipItem: (itemId: string) => {
        set(state => ({
          equippedItems: state.equippedItems.filter(id => id !== itemId),
          inventory: state.inventory.map(item =>
            item.id === itemId ? { ...item, equipped: false } : item
          )
        }));
      },

      removeItem: (itemId: string) => {
        set(state => ({
          inventory: state.inventory.filter(item => item.id !== itemId)
        }));
      },

      startQuest: (quest: Quest) => {
        set(state => ({
          activeQuests: [...state.activeQuests, quest]
        }));
        get().addMessage({
          content: `New Quest: ${quest.title}\n${quest.description}`,
          type: 'system'
        });
      },

      completeQuest: (questId: string) => {
        const state = get();
        const quest = state.activeQuests.find(q => q.id === questId);
        
        if (quest) {
          // Apply rewards
          if (quest.rewards.experience) {
            get().addExperience(quest.rewards.experience);
          }
          if (quest.rewards.reputation) {
            set(state => ({ reputation: state.reputation + quest.rewards.reputation }));
          }
          if (quest.rewards.items) {
            quest.rewards.items.forEach(item => get().addItem(item));
          }
          if (quest.rewards.skills) {
            Object.entries(quest.rewards.skills).forEach(([skill, amount]) => {
              get().updateSkill(skill as keyof RPGState['skills'], amount);
            });
          }

          set(state => ({
            activeQuests: state.activeQuests.filter(q => q.id !== questId),
            completedQuests: [...state.completedQuests, questId]
          }));

          get().addMessage({
            content: `Quest Completed: ${quest.title}`,
            type: 'system'
          });
        }
      },

      updateSkill: (skill: keyof RPGState['skills'], amount: number) => {
        set(state => ({
          skills: {
            ...state.skills,
            [skill]: Math.max(1, Math.min(100, state.skills[skill] + amount))
          }
        }));
      },

      resetProgress: () => {
        set({ ...INITIAL_STATE, messages: [] });
      }
    }),
    {
      name: 'quantum-rpg-save'
    }
  )
);