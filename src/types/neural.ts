export interface NeuralNode {
  id: string;
  type: 'input' | 'hidden' | 'output' | 'quantum' | 'neural' | 'bridge' | 'firewall' | 'core';
  state: 'locked' | 'unlocked' | 'corrupted' | 'active' | 'overloaded';
  connections: string[];
  securityLevel: number;
  data: string;
  energy?: number;
  maxEnergy?: number;
  stability?: number;
  lastActivated?: number;
}

export interface NodeType {
  id: string;
  name: string;
  color: string;
  maxEnergy: number;
  stabilityThreshold: number;
  description: string;
}

export interface PuzzleReward {
  securityLevel: number;
  easterEgg: string;
}

export interface Puzzle {
  id: string;
  nodes: {
    id: number;
    x: number;
    y: number;
    activated: boolean;
    connections: number[];
    energy: number;
    type: 'quantum' | 'neural' | 'bridge' | 'firewall' | 'core';
  }[];
  targetPattern: boolean[];
  hint: string;
  description: string;
  solution: number[];
  requiredEnergy: number;
  difficulty: number;
  reward: PuzzleReward;
}

export interface NeuralCommand {
  command: string;
  args: string[];
  timestamp: Date;
  message: string;
  data?: any;
  level?: 'info' | 'success' | 'warning' | 'error' | 'system';
  code?: string;
}

export interface NeuralResponse {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  data?: any;
  timestamp: Date;
}

export interface NeuralState {
  nodes: { [key: string]: NeuralNode };
  activeNode: string | null;
  securityLevel: number;
  commandHistory: NeuralCommand[];
  responseLog: Array<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timestamp: Date;
  }>;
  isUnlocked: boolean;
  tutorial: {
    active: boolean;
    step: number;
    completed: boolean;
    progress: Record<string, boolean>;
  };
  settings: {
    showNodeLabels: boolean;
    showEnergyLevels: boolean;
    showTutorialHints: boolean;
    difficulty: 'normal' | 'easy' | 'hard';
  };
  stats: {
    nodesHacked: number;
    puzzlesSolved: number;
    failedAttempts: number;
    timeSpent: number;
  };
  currentEnergy: number;
  maxEnergy: number;
  stability: number;
  lastAction: number;
  achievements: string[];
  easterEggsFound: string[];
  currentPuzzle: number;
}