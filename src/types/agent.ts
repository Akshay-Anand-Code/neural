export interface Agent {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
  hologramModel: string | null;
  config?: {
    phone: string;
    pathwayId: string;
    voice?: string;
  };
  background: {
    history: string[];
    beliefs: string[];
    goals: string[];
    fears: string[];
    relationships: string[];
  };
  personality: {
    tone: string;
    traits: string[];
    catchphrases: string[];
    speech_patterns: string[];
    triggers: string[];
    mannerisms: string[];
  };
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'agent';
  isGenerating?: boolean;
}

export interface AgentStats {
  level: number;
  experience: number;
  stats: {
    influence: number;
    knowledge: number;
    trust: number;
    connection: number;
  };
}

export interface StatReward {
  experience: number;
  stats: Partial<AgentStats['stats']>;
  message: string;
}

export interface AgentStore {
  agents: Agent[];
  selectedAgent: Agent | null;
  messagesByAgent: Record<string, Message[]>;
  isCallActive: boolean;
  agentStats: Record<string, AgentStats>;
  loadAgents: () => Promise<void>;
  selectAgent: (id: string) => void;
  addMessage: (message: Message) => Promise<void>;
  clearMessages: () => void;
  loadChatHistory: (agentId: string) => Promise<void>;
  startCall: (phoneNumber: string, countryCode: string) => Promise<{ success: boolean; message: string }>;
  endCall: () => void;
  getCallStatus: () => Promise<string>;
}

export interface AgentStore {
  agents: Agent[];
  selectedAgent: Agent | null;
  messagesByAgent: Record<string, Message[]>;
  isCallActive: boolean;
  agentStats: Record<string, AgentStats>;
  loadAgents: () => Promise<void>;
  selectAgent: (id: string) => void;
  addMessage: (message: Message) => Promise<void>;
  clearMessages: () => void;
  loadChatHistory: (agentId: string) => Promise<void>;
  startCall: (phoneNumber: string, countryCode: string) => Promise<{ success: boolean; message: string }>;
  endCall: () => void;
  getCallStatus: () => Promise<string>;
}