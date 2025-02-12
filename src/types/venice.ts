export interface VeniceConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface ChatOptions {
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  model?: string;
  playerState?: {
    level: number;
    skills: Record<string, number>;
    inventory: any[];
    activeQuests: any[];
  };
}

export interface VeniceResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}