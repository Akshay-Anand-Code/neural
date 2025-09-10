import { create } from 'zustand';
import type { NeuralState, NeuralCommand, NeuralResponse } from '../types/neural';
import { venice } from '../utils/venice';
import { puzzles } from '../data/puzzles';
import { neuralAI } from '../utils/neuralAI';

import type { NeuralNode } from '../types/neural';

const INITIAL_NODES: Record<string, NeuralNode> = {
  'core-0': {
    id: 'core-0',
    type: 'input',
    state: 'locked',
    connections: ['mem-1', 'mem-2'],
    securityLevel: 1,
    data: 'QUANTUM_CORE'
  },
  'mem-1': {
    id: 'mem-1',
    type: 'hidden',
    state: 'locked',
    connections: ['core-0', 'sec-1'],
    securityLevel: 2,
    data: 'NEURAL_CACHE'
  },
  'mem-2': {
    id: 'mem-2',
    type: 'hidden',
    state: 'locked',
    connections: ['core-0', 'sec-2'],
    securityLevel: 2,
    data: 'MEMORY_BANK'
  },
  'sec-1': {
    id: 'sec-1',
    type: 'output',
    state: 'locked',
    connections: ['mem-1'],
    securityLevel: 3,
    data: 'FIREWALL'
  },
  'sec-2': {
    id: 'sec-2',
    type: 'output',
    state: 'locked',
    connections: ['mem-2'],
    securityLevel: 3,
    data: 'ENCRYPTION'
  }
};

const INITIAL_STATE = {
  nodes: INITIAL_NODES,
  activeNode: null,
  securityLevel: 1,
  easterEggsFound: [],
  currentPuzzle: 0,
  commandHistory: [],
  responseLog: [],
  isUnlocked: false,
  tutorial: {
    active: true,
    step: 0,
    completed: false,
    progress: {}
  },
  settings: {
    showNodeLabels: true,
    showEnergyLevels: true,
    showTutorialHints: true,
    difficulty: 'normal'
  },
  stats: {
    nodesHacked: 0,
    puzzlesSolved: 0,
    failedAttempts: 0,
    timeSpent: 0
  },
  currentEnergy: 0,
  maxEnergy: 100,
  stability: 100,
  lastAction: Date.now(),
  achievements: []
};

const TUTORIAL_STEPS = [
  {
    id: 'basics',
    title: 'NEURAL INTERFACE BASICS',
    command: 'HELP',
    hint: 'Type HELP to view available commands'
  },
  {
    id: 'scanning',
    title: 'QUANTUM SCANNING',
    command: 'SCAN core-0',
    hint: 'Use SCAN to analyze node properties'
  },
  {
    id: 'hacking',
    title: 'NODE INFILTRATION',
    command: 'HACK core-0',
    hint: 'HACK nodes to gain control'
  },
  {
    id: 'energy',
    title: 'ENERGY MANAGEMENT',
    command: 'STATUS',
    hint: 'Monitor system energy levels'
  },
  {
    id: 'advanced',
    title: 'ADVANCED TECHNIQUES',
    command: 'ANALYZE',
    hint: 'Use ANALYZE for quantum insights'
  }
];

interface NeuralStore extends NeuralState {
  executeCommand: (input: string) => Promise<void>;
  resetSystem: () => void;
}

const HELP_TEXT = `
Available commands:
  SCAN [node-id]     - Scan node status and connections
  CONNECT [node-id]  - Attempt to connect to a node
  HACK [node-id]     - Attempt to breach node security
  ANALYZE           - Get AI analysis of current puzzle state
  HINT             - Request a hint from the neural AI
  STATUS            - Display system status
  CLEAR             - Clear terminal
  HELP              - Show this help message
`;

export const useNeuralStore = create<NeuralStore>((set, get) => ({
  ...INITIAL_STATE,

  executeCommand: async (input: string) => {
    // Handle empty input first
    if (!input.trim()) {
      set(state => ({
        responseLog: [...state.responseLog, {
          type: 'error',
          message: 'ERROR: No command entered. Type HELP to see available commands.',
          timestamp: new Date()
        }]
      }));
      return;
    }

    // Define addResponse at the start of executeCommand
    const addResponse = (response: NeuralResponse) => {
      set(state => ({
        responseLog: [...state.responseLog, { ...response, timestamp: new Date() }]
      }));
    };

    const args = input.trim().toUpperCase().split(' ');
    const command = args.shift() || '';
    const timestamp = new Date();
    const state = get();
    
    // Tutorial progress tracking
    if (state.tutorial.active && !state.tutorial.completed) {
      const currentStep = TUTORIAL_STEPS[state.tutorial.step];
      if (currentStep && command === currentStep.command) {
        set(state => ({
          tutorial: {
            ...state.tutorial,
            progress: { ...state.tutorial.progress, [currentStep.id]: true },
            step: state.tutorial.step + 1,
            completed: state.tutorial.step === TUTORIAL_STEPS.length - 1
          }
        }));
        
        // Show completion message
        addResponse({
          type: 'success',
          message: `TUTORIAL STEP COMPLETE: ${currentStep.title}`,
          timestamp
        });
        
        // Show next step hint
        const nextStep = TUTORIAL_STEPS[state.tutorial.step + 1];
        if (nextStep) {
          addResponse({
            type: 'info',
            message: `NEXT OBJECTIVE: ${nextStep.hint}`,
            timestamp
          });
        }
      }
    }

    // Log the command
    set(state => ({
      commandHistory: [...state.commandHistory, { command, args, timestamp }]
    }));

    const { nodes, activeNode, securityLevel } = get();

    switch (command) {
      case 'MATRIX':
        // Easter egg: Matrix code rain effect
        addResponse({
          type: 'success',
          message: 'MATRIX MODE ACTIVATED: Reality distortion field engaged',
          timestamp
        });
        set(state => ({
          easterEggsFound: [...state.easterEggsFound, 'matrix'],
          responseLog: [
            ...state.responseLog,
            {
              type: 'info',
              message: `
⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⢸⣿⣿WAKE UP NEO...⣿⣿⣿⣿⣿⣿
⠀⠀⠀⢸⣿THE MATRIX HAS YOU⣿⣿⣿⣿⣿
⠀⠀⠀⢸⣿FOLLOW THE WHITE RABBIT⣿⣿⣿
⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`,
              timestamp
            }
          ]
        }));
        break;

      case 'KONAMI':
        // Easter egg: Konami code activated
        if (get().easterEggsFound.includes('konami')) {
          addResponse({
            type: 'warning',
            message: 'CHEAT CODE ALREADY ACTIVATED',
            timestamp
          });
          break;
        }
        set(state => ({
          securityLevel: state.securityLevel + 1,
          easterEggsFound: [...state.easterEggsFound, 'konami']
        }));
        addResponse({
          type: 'success',
          message: '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA - SECURITY LEVEL INCREASED!',
          timestamp
        });
        break;

      case 'TIME':
        // Easter egg: Hidden time travel message
        const timeMessage = new Date(0).toISOString();
        addResponse({
          type: 'warning',
          message: `TEMPORAL ANOMALY DETECTED\nTIMESTAMP ORIGIN: ${timeMessage}\nCAUSALITY BREACH IMMINENT`,
          timestamp
        });
        set(state => ({
          easterEggsFound: [...state.easterEggsFound, 'time']
        }));
        break;

      case 'COFFEE':
        // Easter egg: Coffee machine error
        addResponse({
          type: 'error',
          message: `ERROR: COFFEE.EXE - INSUFFICIENT RESOURCES
418: I'm a teapot
Please refer to RFC 2324 for proper hyper text coffee pot control protocol.`,
          timestamp
        });
        set(state => ({
          easterEggsFound: [...state.easterEggsFound, 'coffee']
        }));
        break;

      case 'ANALYZE':
        const puzzle = puzzles[get().currentPuzzle];
        const currentPattern = Object.values(nodes).map(n => n.state === 'active');
        
        try {
          const analysis = await neuralAI.analyzeSolution(puzzle, currentPattern);
          addResponse({
            type: 'info',
            message: analysis,
            timestamp
          });
        } catch (error) {
          addResponse({
            type: 'error',
            message: 'QUANTUM ANALYSIS FAILED: Neural interface disrupted',
            timestamp
          });
        }
        break;

      case 'HINT':
        const currentPuzzle = puzzles[get().currentPuzzle];
        try {
          const hint = await neuralAI.generatePuzzleHint(currentPuzzle);
          addResponse({
            type: 'info',
            message: hint,
            timestamp
          });
        } catch (error) {
          addResponse({
            type: 'error',
            message: 'NEURAL INTERFACE ERROR: Unable to generate hint',
            timestamp
          });
        }
        break;

      case 'HELP':
        addResponse({
          type: 'info',
          message: `${HELP_TEXT}

${state.tutorial.active ? '[TUTORIAL MODE ACTIVE]' : ''}
${state.settings.showTutorialHints ? '\nTIP: Use STATUS to check system state' : ''}
${state.securityLevel >= 3 ? '\nHidden commands may exist...\nSeek the truth in the code.' : ''}

SETTINGS:
- Difficulty: ${state.settings.difficulty.toUpperCase()}
- Node Labels: ${state.settings.showNodeLabels ? 'ON' : 'OFF'}
- Energy Levels: ${state.settings.showEnergyLevels ? 'ON' : 'OFF'}
- Tutorial Hints: ${state.settings.showTutorialHints ? 'ON' : 'OFF'}`,
          timestamp
        });
        break;

      case 'CLEAR':
        set({ responseLog: [] });
        break;

      case 'STATUS':
        const activeNodes = Object.values(nodes).filter(n => n.state === 'active').length;
        const totalNodes = Object.keys(nodes).length;
        const eggsFound = get().easterEggsFound.length;
        const totalEggs = 7;
        const stats = get().stats;

        addResponse({
          type: 'info',
          message: `
SYSTEM STATUS:
- Security Level: ${securityLevel}
- Active Nodes: ${activeNodes}/${totalNodes}
- Easter Eggs: ${eggsFound}/${totalEggs}
- Current Node: ${activeNode || 'None'}
- System Access: ${get().isUnlocked ? 'GRANTED' : 'RESTRICTED'}

NEURAL METRICS:
- Nodes Hacked: ${stats.nodesHacked}
- Puzzles Solved: ${stats.puzzlesSolved}
- Failed Attempts: ${stats.failedAttempts}
- Time in System: ${Math.floor(stats.timeSpent / 60)}m ${stats.timeSpent % 60}s

${state.tutorial.active ? '[TUTORIAL PROGRESS: ' + (state.tutorial.step + 1) + '/' + TUTORIAL_STEPS.length + ']' : ''}
`,
          timestamp
        });
        break;

      case 'SETTINGS':
        const setting = args[0];
        const value = args[1];

        if (!setting) {
          addResponse({
            type: 'info',
            message: `
AVAILABLE SETTINGS:
- DIFFICULTY [EASY|NORMAL|HARD]
- LABELS [ON|OFF]
- ENERGY [ON|OFF]
- HINTS [ON|OFF]
- TUTORIAL [ON|OFF]

Current Configuration:
${Object.entries(state.settings)
  .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
  .join('\n')}`,
            timestamp
          });
          break;
        }

        switch (setting) {
          case 'DIFFICULTY':
            if (['EASY', 'NORMAL', 'HARD'].includes(value)) {
              set(state => ({
                settings: {
                  ...state.settings,
                  difficulty: value.toLowerCase() as 'easy' | 'normal' | 'hard'
                }
              }));
              addResponse({
                type: 'success',
                message: `Difficulty set to ${value}`,
                timestamp
              });
            } else {
              addResponse({
                type: 'error',
                message: 'Invalid difficulty. Use EASY, NORMAL, or HARD',
                timestamp
              });
            }
            break;

          case 'LABELS':
          case 'ENERGY':
          case 'HINTS':
            const settingMap = {
              LABELS: 'showNodeLabels',
              ENERGY: 'showEnergyLevels',
              HINTS: 'showTutorialHints'
            };
            if (['ON', 'OFF'].includes(value)) {
              set(state => ({
                settings: {
                  ...state.settings,
                  [settingMap[setting]]: value === 'ON'
                }
              }));
              addResponse({
                type: 'success',
                message: `${setting} ${value}`,
                timestamp
              });
            } else {
              addResponse({
                type: 'error',
                message: 'Invalid value. Use ON or OFF',
                timestamp
              });
            }
            break;

          case 'TUTORIAL':
            if (['ON', 'OFF'].includes(value)) {
              set(state => ({
                tutorial: {
                  ...state.tutorial,
                  active: value === 'ON'
                }
              }));
              addResponse({
                type: 'success',
                message: `Tutorial mode ${value}`,
                timestamp
              });
            } else {
              addResponse({
                type: 'error',
                message: 'Invalid value. Use ON or OFF',
                timestamp
              });
            }
            break;

          default:
            addResponse({
              type: 'error',
              message: 'Invalid setting. Type SETTINGS for help.',
              timestamp
            });
        }
        break;

      case 'CONNECT':
        const targetId = args[0];
        const targetNode = nodes[targetId];

        if (!targetId) {
          addResponse({
            type: 'error',
            message: 'SYNTAX ERROR: Node ID required',
            timestamp
          });
          break;
        }

        if (!targetNode) {
          addResponse({
            type: 'error',
            message: 'ERROR: Invalid node ID',
            timestamp
          });
          break;
        }

        if (targetNode.state === 'locked') {
          addResponse({
            type: 'error',
            message: 'ACCESS DENIED: Node is locked',
            timestamp
          });
          break;
        }

        if (activeNode && !nodes[activeNode].connections.includes(targetId)) {
          addResponse({
            type: 'error',
            message: 'CONNECTION ERROR: Nodes not directly connected',
            timestamp
          });
          break;
        }

        set({ activeNode: targetId });
        addResponse({
          type: 'success',
          message: `Successfully connected to node ${targetId}`,
          timestamp
        });
        break;

      case 'HACK':
        const hackId = args[0];
        const hackNode = nodes[hackId];

        // Update stats
        set(state => ({
          stats: {
            ...state.stats,
            nodesHacked: state.stats.nodesHacked + (hackNode && hackNode.state !== 'active' ? 1 : 0)
          }
        }));

        if (!hackId) {
          addResponse({
            type: 'error',
            message: 'SYNTAX ERROR: Node ID required',
            timestamp
          });
          break;
        }

        if (!hackNode) {
          addResponse({
            type: 'error',
            message: 'ERROR: Invalid node ID',
            timestamp
          });
          break;
        }

        if (hackNode.state === 'active') {
          addResponse({
            type: 'error',
            message: 'ERROR: Node already compromised',
            timestamp
          });
          break;
        }

        if (hackNode.securityLevel > securityLevel) {
          addResponse({
            type: 'error',
            message: 'ACCESS DENIED: Insufficient security clearance',
            timestamp
          });
          break;
        }

        // Generate hack response using Venice AI
        try {
          const response = await venice.chat(
            `Generate a brief, technical response for hacking a neural node with data type ${hackNode.data}. Include quantum computing terminology.`,
            {
              systemPrompt: `You are a quantum neural network interface. Your responses should be:
              - Technical and cryptic
              - Use quantum computing terminology
              - Reference neural networks and cyberpunk themes
              - Keep responses concise (1-2 sentences)`,
              temperature: 0.7,
              maxTokens: 50,
              model: 'gpt-4o-mini'
            }
          );

          // Update node state
          const updatedNodes = { ...nodes };
          updatedNodes[hackId].state = 'active';

          try {
            // Check if all nodes are active
            const allNodesActive = Object.values(updatedNodes)
              .every(n => n.state === 'active');
            
            // Check if puzzle is solved
            const puzzle = puzzles[get().currentPuzzle];
            const currentPattern = Object.values(updatedNodes).map(n => n.state === 'active');
            const puzzleSolved = currentPattern.every((active, i) => active === puzzle.targetPattern[i]);

            set(state => ({
              nodes: updatedNodes,
              securityLevel: puzzleSolved ? state.securityLevel + 1 : state.securityLevel,
              currentPuzzle: puzzleSolved ? Math.min(state.currentPuzzle + 1, puzzles.length - 1) : state.currentPuzzle,
              isUnlocked: allNodesActive,
              stats: {
                ...state.stats,
                puzzlesSolved: state.stats.puzzlesSolved + (puzzleSolved ? 1 : 0)
              }
            }));

            addResponse({
              type: 'success',
              message: response,
              timestamp
            });

            if (puzzleSolved) {
              addResponse({
                type: 'warning',
                message: 'QUANTUM STATE ACHIEVED: Neural pattern matched - Advancing to next security level',
                timestamp
              });
            }
          } catch (error) {
            console.error('Error updating game state:', error);
            set(state => ({
              stats: {
                ...state.stats,
                failedAttempts: state.stats.failedAttempts + 1
              }
            }));
            addResponse({
              type: 'error',
              message: 'ERROR: Failed to update quantum state',
              timestamp
            });
          }
        } catch (error) {
          addResponse({
            type: 'error',
            message: 'ERROR: Neural interface disrupted',
            timestamp
          });
        }
        break;

      default:
        addResponse({
          type: 'error',
          message: 'ERROR: Unknown command. Type HELP for available commands.',
          timestamp
        });
    }
  },

  resetSystem: () => {
    set({
      ...INITIAL_STATE,
      responseLog: [],
      tutorial: {
        active: true,
        step: 0,
        completed: false,
        progress: {}
      }
    });
  }
}));