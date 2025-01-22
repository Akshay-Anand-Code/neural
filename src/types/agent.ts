export interface Agent {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
  hologramModel: string | null;
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
}