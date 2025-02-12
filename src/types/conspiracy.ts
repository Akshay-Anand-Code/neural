export interface ConspiracyConversation {
  id: string;
  title: string;
  messages: ConspiracyMessage[];
  createdAt: Date;
}

export interface ConspiracyMessage {
  id: string;
  content: string;
  type: 'user' | 'system';
  timestamp: Date;
  isGenerating?: boolean;
}