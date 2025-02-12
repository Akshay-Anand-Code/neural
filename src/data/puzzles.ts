import type { Puzzle } from '../types/neural';

export const puzzles: Puzzle[] = [
  {
    id: 'quantum-resonance',
    nodes: [
      { id: 0, x: -1, y: 1, activated: false, connections: [1, 2], energy: 100, type: 'quantum' },
      { id: 1, x: 1, y: 1, activated: false, connections: [0, 2], energy: 100, type: 'neural' },
      { id: 2, x: 0, y: -1, activated: false, connections: [0, 1], energy: 100, type: 'bridge' }
    ],
    targetPattern: [true, true, false],
    hint: "QUANTUM RESONANCE DETECTED: Establish neural bridge via parallel nodes",
    description: "Initialize quantum entanglement by creating a stable neural pathway. Energy synchronization required.",
    solution: [0, 1],
    requiredEnergy: 150,
    difficulty: 1,
    reward: {
      securityLevel: 1,
      easterEgg: 'quantum-sight'
    }
  },
  {
    id: 'neural-triangulation',
    nodes: [
      { id: 0, x: -1, y: 0, activated: false, connections: [1, 2], energy: 80, type: 'quantum' },
      { id: 1, x: 1, y: 0, activated: false, connections: [0, 3], energy: 80, type: 'neural' },
      { id: 2, x: 0, y: 1, activated: false, connections: [0, 3], energy: 80, type: 'bridge' },
      { id: 3, x: 0, y: -1, activated: false, connections: [1, 2], energy: 80, type: 'firewall' }
    ],
    targetPattern: [true, true, false, true],
    hint: "NEURAL TRIANGULATION REQUIRED: Form quantum circuit with precise node activation",
    description: "Establish tri-node quantum resonance while maintaining energy equilibrium. Avoid cascade failure.",
    solution: [0, 1, 3],
    requiredEnergy: 200,
    difficulty: 2,
    reward: {
      securityLevel: 2,
      easterEgg: 'neural-sight'
    }
  },
  {
    id: 'quantum-matrix',
    nodes: [
      { id: 0, x: 0, y: 1, activated: false, connections: [2, 3], energy: 60, type: 'quantum' },
      { id: 1, x: 0, y: -1, activated: false, connections: [2, 3], energy: 60, type: 'neural' },
      { id: 2, x: -1, y: 0, activated: false, connections: [0, 1], energy: 60, type: 'bridge' },
      { id: 3, x: 1, y: 0, activated: false, connections: [0, 1], energy: 60, type: 'firewall' }
    ],
    targetPattern: [true, false, true, true],
    hint: "ASYMMETRIC QUANTUM STATE DETECTED: Balance neural load across active nodes",
    description: "Create asymmetric neural bridge while preventing quantum decoherence. Energy distribution critical.",
    solution: [0, 2, 3],
    requiredEnergy: 250,
    difficulty: 3,
    reward: {
      securityLevel: 3,
      easterEgg: 'matrix-sight'
    }
  },
  {
    id: 'quantum-pentagram',
    nodes: [
      { id: 0, x: 0, y: 2, activated: false, connections: [1, 4], energy: 50, type: 'quantum' },
      { id: 1, x: -1.5, y: 1, activated: false, connections: [0, 2, 3], energy: 50, type: 'neural' },
      { id: 2, x: 1.5, y: 1, activated: false, connections: [1, 3, 4], energy: 50, type: 'bridge' },
      { id: 3, x: -1, y: -1, activated: false, connections: [1, 2], energy: 50, type: 'firewall' },
      { id: 4, x: 1, y: -1, activated: false, connections: [0, 2], energy: 50, type: 'core' }
    ],
    targetPattern: [true, true, false, true, true],
    hint: "PENTAGONAL QUANTUM MATRIX DETECTED: Strategic node deactivation required",
    description: "Establish complex neural circuit with precise energy management. Avoid quantum feedback loops.",
    solution: [0, 1, 3, 4],
    requiredEnergy: 300,
    difficulty: 4,
    reward: {
      securityLevel: 4,
      easterEgg: 'quantum-master'
    }
  }
];