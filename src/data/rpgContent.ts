import type { Quest, InventoryItem, GameChoice } from '../types/rpg';

export const STARTER_ITEMS: InventoryItem[] = [
  {
    id: 'basic-decoder',
    name: 'Basic Neural Decoder',
    description: 'A simple tool for decoding neural patterns',
    type: 'tool',
    rarity: 'common',
    effects: {
      hacking: 1
    }
  },
  {
    id: 'quantum-manual',
    name: 'Quantum Computing Manual',
    description: 'Basic guide to quantum mechanics and computing',
    type: 'data',
    rarity: 'common',
    effects: {
      quantum: 1
    }
  }
];

export const QUESTS: Quest[] = [
  {
    id: 'neural-initiation',
    title: 'Neural Network Initiation',
    description: 'Complete your initial training in the neural network',
    status: 'active',
    objectives: [
      {
        id: 'hack-node-1',
        description: 'Successfully hack your first neural node',
        completed: false,
        type: 'hack',
        target: 'node-1',
        progress: 0,
        required: 1
      },
      {
        id: 'analyze-pattern',
        description: 'Analyze a quantum pattern',
        completed: false,
        type: 'analyze',
        target: 'pattern-1',
        progress: 0,
        required: 1
      }
    ],
    rewards: {
      experience: 100,
      reputation: 10,
      items: [
        {
          id: 'quantum-key',
          name: 'Quantum Encryption Key',
          description: 'A basic quantum key for secure communications',
          type: 'tool',
          rarity: 'rare',
          effects: {
            encryption: 2
          }
        }
      ]
    }
  }
];

export const STORY_CHOICES: GameChoice[] = [
  {
    id: 'investigate-anomaly',
    text: 'Investigate the quantum anomaly in sector 7',
    requirements: {
      skills: {
        quantum: 2
      }
    },
    consequences: {
      success: {
        text: 'You successfully analyze the anomaly and discover a hidden quantum pathway.',
        effects: {
          experience: 50,
          reputation: 5,
          skills: {
            quantum: 1,
            analysis: 1
          }
        }
      },
      failure: {
        text: 'The quantum fluctuations overwhelm your sensors. The anomaly remains a mystery.',
        effects: {
          experience: 10
        }
      }
    }
  },
  {
    id: 'hack-firewall',
    text: 'Attempt to breach the quantum firewall',
    requirements: {
      skills: {
        hacking: 3,
        encryption: 2
      },
      items: ['quantum-key']
    },
    consequences: {
      success: {
        text: 'You successfully breach the firewall, revealing a network of hidden nodes.',
        effects: {
          experience: 100,
          reputation: 10,
          skills: {
            hacking: 2,
            encryption: 1
          },
          quests: {
            add: [
              {
                id: 'hidden-network',
                title: 'The Hidden Network',
                description: 'Explore the newly discovered network of quantum nodes',
                status: 'active',
                objectives: [
                  {
                    id: 'map-network',
                    description: 'Map the hidden network topology',
                    completed: false,
                    type: 'analyze',
                    target: 'hidden-network',
                    progress: 0,
                    required: 1
                  }
                ],
                rewards: {
                  experience: 200,
                  reputation: 20
                }
              }
            ]
          }
        }
      },
      failure: {
        text: 'The firewall defenses prove too strong. Your attempt is logged and traced.',
        effects: {
          reputation: -5,
          skills: {
            encryption: 1
          }
        }
      }
    }
  }
];