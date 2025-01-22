import { create } from 'zustand';
import { Agent, Message } from '../types/agent';
import { loadAgents } from '../utils/loadAgents';
import { OpenAI } from 'openai';
import { DeepSeekProvider } from '../utils/deepseek';
import { db } from '../db';

// Initialize DeepSeek provider
const deepseek = new DeepSeekProvider({
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  baseUrl: 'https://api.deepseek.com'
});

// Message type for API
type APIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

interface AgentStore {
  agents: Agent[];
  selectedAgent: Agent | null;
  userId: string;
  currentConversationId: string | null;
  messages: Message[];
  isCallActive: boolean;
  selectAgent: (agentId: string) => void;
  resetAgent: () => void;
  addMessage: (message: Message) => void;
  loadChatHistory: (agentId: string) => Promise<void>;
  startCall: () => void;
  endCall: () => void;
}

export const useAgentStore = create<AgentStore>((set) => {
  // Generate a user ID and create user in database
  const userId = crypto.randomUUID();
  
  // Load agents immediately
  loadAgents().then(loadedAgents => {
    set({ agents: loadedAgents });
  }).catch(error => {
    console.error('Failed to load agents:', error);
    set({ agents: [] });
  });

  return {
  agents: [],
  selectedAgent: null,
  userId,
  currentConversationId: null,
  messages: [],
  isCallActive: false,
  selectAgent: (agentId) => {
    set((state) => {
      const agent = state.agents.find(a => a.id === agentId);
      let newState = { selectedAgent: agent || null, messages: [] };
      
      // Create welcome message with agent info
      if (agent) {
        const welcomeMessage = {
          id: crypto.randomUUID(),
          agentId: agent.id,
          content: `[AGENT PROFILE]

Name: ${agent.name}
Title: ${agent.title}

Description: ${agent.description}

Personality Analysis:
• Tone: ${agent.personality.tone}
• Core Traits: ${agent.personality.traits.join(', ')}

[SECURE CHANNEL ESTABLISHED]
You may now begin your conversation...`,
          timestamp: new Date(),
          type: 'agent'
        };

        newState.messages = [welcomeMessage];
      }
      
      // Create a new conversation in the database
      if (agent) {
        (async () => {
          try {
            await db.createUser(state.userId);
            const conversationId = await db.createConversation(state.userId, agent.id);
            set(state => ({ ...state, currentConversationId: conversationId }));
          } catch (error) {
            console.error('Error creating conversation:', error);
          }
        })();
      }
      
      return newState;
    });
  },
  resetAgent: () => {
    set({ selectedAgent: null, messages: [], currentConversationId: null });
  },
  loadChatHistory: async (agentId) => {
    const state = useAgentStore.getState();
    const history = await db.getConversationHistory(state.userId, agentId);
    set({ messages: history });
  },
  addMessage: (message) => set(async (state) => {
    const newMessages = [...state.messages, message];
    
    // Immediately update state with user message
    set({ messages: newMessages });
    
    // Save user message to database
    if (state.currentConversationId) {
      try {
        await db.addMessage(
          state.currentConversationId,
          message.content,
          message.type
        );
      } catch (error) {
        console.error('Error saving message to database:', error);
        throw new Error('Failed to save message to database');
      }
    }
    
    // Only process user messages
    if (message.type !== 'user' || !state.selectedAgent) {
      return;
    }

    // Convert agent data to JSON string for the system prompt
    const agentData = JSON.stringify(state.selectedAgent);

    // Create character configuration
    const character = {
      systemPrompt: agentData,
      temperature: message.content.toLowerCase().includes('story') ? 0.85 : 0.8,
      maxTokens: message.content.toLowerCase().includes('story') ? 250 : 200,
      systemInstructions: `
        RESPONSE GUIDELINES:
        1. Stay deeply in character at all times
        2. Use your unique speech patterns and catchphrases
        3. Reference your experiences, beliefs, and fears naturally
        4. Keep responses focused but characterful (15-30 words)
        5. Always end responses naturally, never trailing off
        6. Maintain your worldview and personality consistently
        7. For stories: build suspense and end with impact
      `
    };

    try {
      const agentResponse = await deepseek.chat(message.content, character);
      
      // Clean up response to ensure it's complete
      let cleanedResponse = agentResponse.trim();
      if (cleanedResponse.endsWith('...')) {
        cleanedResponse = cleanedResponse.slice(0, -3) + '.';
      }
      
      // Ensure response ends with proper punctuation
      if (!cleanedResponse.endsWith('.') && !cleanedResponse.endsWith('!') && !cleanedResponse.endsWith('?')) {
        cleanedResponse += '.';
      }

      // Create agent message
      const agentMessage = {
        id: crypto.randomUUID(),
        agentId: state.selectedAgent.id,
        content: cleanedResponse,
        timestamp: new Date(),
        type: 'agent' as const
      };

      // Save agent response to database
      if (state.currentConversationId) {
        await db.addMessage(
          state.currentConversationId,
          agentResponse,
          'agent'
        );
      }
      
      // Update state with agent message
      set(state => ({
        messages: [...state.messages, agentMessage]
      }));
    } catch (error: any) {
      console.error('DeepSeek API error:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: crypto.randomUUID(),
        agentId: state.selectedAgent.id,
        content: error.message || "I apologize, but I'm having trouble connecting. Please try again.",
        timestamp: new Date(),
        type: 'agent' as const
      };
      
      // Update state with error message
      set(state => ({
        messages: [...state.messages, errorMessage]
      }));
    }
  }),
  startCall: () => set({ isCallActive: true }),
  endCall: () => set({ isCallActive: false })
}});