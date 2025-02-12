import { create } from 'zustand';
import { venice } from '../utils/venice';
import { csvApi } from '../api/csvApi';
import { RateLimiter } from '../utils/rateLimiter';
import { API_CONFIG } from '../config/api';
import type { ConspiracyConversation } from '../types/conspiracy';

interface ConspiracyAPI {
  generateConspiracy: (prompt: string, apiKey: string) => Promise<string>;
  getRateLimit: () => { remaining: number; resetIn: number };
}

interface ConspiracyMessage {
  id: string;
  content: string;
  type: 'user' | 'system';
  timestamp: Date;
  isGenerating?: boolean;
}

interface ConspiracyStore {
  messages: ConspiracyMessage[];
  isGenerating: boolean;
  pastConversations: ConspiracyConversation[];
  initialized: boolean;
  addMessage: (message: Omit<ConspiracyMessage, 'id' | 'timestamp'>) => Promise<void>;
  generateConspiracy: (prompt: string) => Promise<void>;
  shareToTwitter: (conspiracy: string) => void;
  loadConversation: (conversation: ConspiracyConversation) => void;
  savePastConversation: () => void;
  clearCurrentConversation: () => void;
  api: ConspiracyAPI;
}

interface ConspiracyConversation {
  id: string;
  title: string;
  messages: ConspiracyMessage[];
  createdAt: Date;
}

const INITIAL_MESSAGES: Omit<ConspiracyMessage, 'id' | 'timestamp'>[] = [
  {
    content: `QUANTUM NEURAL INTERFACE ACTIVATED
CONSPIRACY ANALYSIS MODULE: ONLINE
REALITY DISTORTION FILTERS: ENABLED

Welcome to the Conspiracy Builder, truth seeker. This advanced neural interface is designed to analyze quantum data patterns and generate deep-state revelations by connecting seemingly unrelated events.

Our quantum AI has access to classified data streams and can identify hidden connections that THEY don't want you to see. Simply enter a topic or keyword, and we'll reveal the truth that lies beneath the surface.

Try asking about:
- The true purpose of cryptocurrency
- Hidden meanings in social media algorithms
- Ancient technology and quantum computing
- The reality behind 5G networks

Remember: The truth is out there, hidden in plain sight.`,
    type: 'system'
  },
  {
    content: "SECURITY WARNING: This neural interface is being monitored. Use quantum encryption protocols when sharing sensitive information.",
    type: 'system'
  }
];

export const useConspiracyStore = create<ConspiracyStore>((set, get) => ({
  messages: INITIAL_MESSAGES.map(msg => ({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    ...msg
  })),
  isGenerating: false,
  pastConversations: JSON.parse(localStorage.getItem('pastConspiracies') || '[]'),
  initialized: false,

  addMessage: async (message) => {
    if (!message.content?.trim()) {
      console.error('Empty message content');
      return;
    }

    set((state) => ({
      messages: [...state.messages, {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        ...message
      }]
    }));
  },
  
  loadConversation: (conversation: ConspiracyConversation) => {
    set({
      messages: conversation.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    });
  },

  savePastConversation: () => {
    const { messages } = get();
    // Only save if we have more than welcome messages and at least one user message
    const hasUserMessages = messages.some(m => m.type === 'user');
    if (messages.length <= 2 || !hasUserMessages) return;

    // Get the first user message as the title
    const firstUserMessage = messages.find(m => m.type === 'user');
    
    // Get the first system response after the user message for a better title
    const systemResponse = messages.find(m => 
      m.type === 'system' && 
      messages.indexOf(m) > messages.indexOf(firstUserMessage!)
    );
    
    // Extract the first line of the system response as the title
    const title = systemResponse
      ? systemResponse.content.split('\n')[0].slice(0, 50) + '...'
      : firstUserMessage?.content.slice(0, 50) + '...';

    const conversation: ConspiracyConversation = {
      id: crypto.randomUUID(),
      title,
      messages,
      createdAt: new Date()
    };

    set(state => {
      const newPastConversations = [conversation, ...state.pastConversations];
      localStorage.setItem('pastConspiracies', JSON.stringify(newPastConversations));
      return { pastConversations: newPastConversations };
    });
  },

  clearCurrentConversation: () => {
    set({
      messages: INITIAL_MESSAGES.map(msg => ({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        ...msg
      }))
    });
  },

  generateConspiracy: async (prompt: string) => {
    set({ isGenerating: true });

    // Add user message with generating state
    await get().addMessage({
      content: prompt,
      type: 'user',
      isGenerating: true
    });


    try {
      // First, get data from CSV files
      const files = await csvApi.getFiles();
      const fileData = await Promise.all(files.map(async (file) => {
        const result = await csvApi.getFileContents(file);
        return result.success ? result.data : null;
      }));

      // Filter out failed requests and combine data
      const allData = fileData
        .filter(Boolean)
        .map(data => data?.data || [])
        .flat();

      // Build context from CSV data
      const context = allData
        .map(row => Object.values(row).join(' '))
        .join('\n');

      // Generate conspiracy using Venice AI
      const conspiracy = await venice.chat(prompt, {
        systemPrompt: `You are a conspiracy theory generator that creates wild but entertaining conspiracies based on real data. Use the following data as inspiration, but create original and engaging theories that connect seemingly unrelated events in unexpected ways.

DATA CONTEXT:
${context}

GUIDELINES:
1. Create engaging, dramatic conspiracies that sound plausible but are clearly fictional
2. Reference real events/data from the provided context
3. Add unexpected twists and connections
4. Include specific details and "evidence"
5. Make it entertaining and shareable
6. Keep the tone mysterious and dramatic

Format the response with:
- A catchy title in ALL CAPS
- The main theory
- "Evidence" points
- A dramatic conclusion`,
        temperature: 0.9,
        maxTokens: 500
      });

      // Add the generated conspiracy as a system message
      await get().addMessage({
        content: conspiracy,
        type: 'system'
      });

      // Save the conversation after generating the response
      get().savePastConversation();

    } catch (error) {
      console.error('Error generating conspiracy:', error);
      await get().addMessage({
        content: 'ERROR: Neural interface disrupted while accessing classified data. Please try again.',
        type: 'system'
      });
    } finally {
      set({ isGenerating: false });
    }
  },

  shareToTwitter: (conspiracy: string) => {
    // Format conspiracy for Twitter
    const tweetText = `${conspiracy.slice(0, 240)}... @iluminatibot #ConspiracyGenerator`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
  },

  // API Interface
  api: {
    generateConspiracy: async (prompt: string, apiKey: string) => {
      // Validate API key from data vault
      if (!csvApi.validateApiKey(apiKey)) {
        throw new Error('Invalid API key');
      }

      // Generate conspiracy using same logic as internal method
      const files = await csvApi.getFiles();
      const fileData = await Promise.all(files.map(async (file) => {
        const result = await csvApi.getFileContents(file, apiKey);
        return result.success ? result.data : null;
      }));

      const allData = fileData
        .filter(Boolean)
        .map(data => data?.data || [])
        .flat();

      const context = allData
        .map(row => Object.values(row).join(' '))
        .join('\n');

      return venice.chat(prompt, {
        systemPrompt: `You are a conspiracy theory generator that creates wild but entertaining conspiracies based on real data. Use the following data as inspiration, but create original and engaging theories that connect seemingly unrelated events in unexpected ways.

DATA CONTEXT:
${context}

GUIDELINES:
1. Create engaging, dramatic conspiracies that sound plausible but are clearly fictional
2. Reference real events/data from the provided context
3. Add unexpected twists and connections
4. Include specific details and "evidence"
5. Make it entertaining and shareable
6. Keep the tone mysterious and dramatic

Format the response with:
- A catchy title in ALL CAPS
- The main theory
- "Evidence" points
- A dramatic conclusion`,
        temperature: 0.9,
        maxTokens: 500
      });
    },
    getRateLimit: () => {
      return {
        remaining: 60,
        resetIn: 60
      };
    }
  }
}));