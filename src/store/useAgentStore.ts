import { create } from 'zustand';
import { Agent, Message, AgentStats, StatReward } from '../types/agent';
import { loadAgents } from '../utils/loadAgents';
import { venice } from '../utils/venice';
import { blandAI } from '../utils/blandAI';
import { API_CONFIG } from '../config/api';
import { db } from '../db';

interface AgentStore {
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

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  selectedAgent: null,
  messagesByAgent: {},
  agentStats: {},
  isCallActive: false,

  loadAgents: async () => {
    try {
      const agents = await loadAgents();
      
      // Initialize stats for each agent if not exists
      const stats = { ...useAgentStore.getState().agentStats };
      agents.forEach(agent => {
        if (!stats[agent.id]) {
          stats[agent.id] = {
            level: 1,
            experience: 0,
            stats: {
              influence: 1,
              knowledge: 1,
              trust: 1,
              connection: 1
            }
          };
        }
      });
      
      set({ agents, agentStats: stats });
      console.info(`Successfully loaded ${agents.length} agents`);

    } catch (error) {
      console.error('Error in loadAgents:', error instanceof Error ? error.message : error);
      // Don't throw - let the app continue with empty agents array
    }
  },

  selectAgent: (id) => {
    set((state) => ({
      selectedAgent: state.agents.find(agent => agent.id === id) || null,
    }));
  },

  addMessage: async (message) => {
    if (!message.content.trim()) {
      console.error('Empty message content');
      throw new Error('Empty message content');
    }

    set((state) => ({ 
      messagesByAgent: {
        ...state.messagesByAgent,
        [message.agentId]: [
          ...(state.messagesByAgent[message.agentId] || []),
          message
        ]
      }
    }));

    const { selectedAgent } = useAgentStore.getState();
    if (!selectedAgent) {
      throw new Error('No agent selected');
    }

    // Calculate stat rewards based on message content and agent personality
    const calculateReward = (content: string, agent: Agent): StatReward => {
      let reward: StatReward = {
        experience: 10, // Base XP
        stats: {},
        message: ''
      };

      // Check for alignment with agent's beliefs and traits
      const beliefs = agent.background.beliefs.map(b => b.toLowerCase());
      const traits = agent.personality.traits.map(t => t.toLowerCase());
      const content_lower = content.toLowerCase();

      // Increase rewards if message aligns with agent's beliefs/traits
      beliefs.forEach(belief => {
        if (content_lower.includes(belief)) {
          reward.experience += 15;
          reward.stats.knowledge = (reward.stats.knowledge || 0) + 1;
          reward.stats.trust = (reward.stats.trust || 0) + 0.5;
        }
      });

      traits.forEach(trait => {
        if (content_lower.includes(trait)) {
          reward.experience += 10;
          reward.stats.connection = (reward.stats.connection || 0) + 1;
        }
      });

      // Check for keywords indicating influence
      const influenceKeywords = ['agree', 'right', 'true', 'correct', 'understand'];
      influenceKeywords.forEach(keyword => {
        if (content_lower.includes(keyword)) {
          reward.experience += 5;
          reward.stats.influence = (reward.stats.influence || 0) + 0.5;
        }
      });

      // Generate reward message
      if (Object.keys(reward.stats).length > 0) {
        reward.message = `[NEURAL SYNC: Connection strengthened with ${agent.name}]\n`;
        if (reward.stats.knowledge) reward.message += `Knowledge +${reward.stats.knowledge} `;
        if (reward.stats.trust) reward.message += `Trust +${reward.stats.trust} `;
        if (reward.stats.influence) reward.message += `Influence +${reward.stats.influence} `;
        if (reward.stats.connection) reward.message += `Connection +${reward.stats.connection}`;
      }

      return reward;
    };

    // Apply rewards and level up if needed
    const applyRewards = (agentId: string, reward: StatReward) => {
      set(state => {
        const stats = { ...state.agentStats };
        const agentStats = stats[agentId];
        
        // Add experience
        agentStats.experience += reward.experience;
        
        // Calculate new level (every 100 XP)
        const newLevel = Math.floor(agentStats.experience / 100) + 1;
        if (newLevel > agentStats.level) {
          reward.message = `${reward.message}\n[LEVEL UP! Neural connection with ${selectedAgent.name} strengthened to level ${newLevel}]`;
        }
        agentStats.level = newLevel;
        
        // Apply stat increases
        Object.entries(reward.stats).forEach(([stat, value]) => {
          agentStats.stats[stat as keyof AgentStats['stats']] += value;
        });
        
        return { agentStats: stats };
      });
    };

    try {
      console.log('Generating response for agent:', selectedAgent.name);
      
      // Generate agent's response using Venice AI
      const response = await venice.chatWithAgent(message.content, selectedAgent, {
        systemPrompt: venice['buildAgentSystemPrompt'](selectedAgent)
      });

      console.log('Generated response:', response);
      
      const agentMessage: Message = {
        id: crypto.randomUUID(),
        agentId: selectedAgent.id,
        content: response,
        timestamp: new Date(),
        type: 'agent'
      };

      set((state) => ({
        messagesByAgent: {
          ...state.messagesByAgent,
          [selectedAgent.id]: [
            ...(state.messagesByAgent[selectedAgent.id] || []),
            agentMessage
          ]
        }
      }));

      // Calculate and apply rewards
      const reward = calculateReward(message.content, selectedAgent);
      applyRewards(selectedAgent.id, reward);
      
      // Show reward message if there are stat increases
      if (reward.message) {
        await useAgentStore.getState().addMessage({
          id: crypto.randomUUID(),
          agentId: selectedAgent.id,
          content: reward.message,
          timestamp: new Date(),
          type: 'agent'
        });
      }

      try {
        await db.addMessage(message.id, message.content, 'user');
        await db.addMessage(agentMessage.id, agentMessage.content, 'agent');
      } catch (dbError) {
        console.error('Failed to store messages in database:', dbError);
      }

    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to generate response');
    }
  },

  clearMessages: () => {
    set((state) => ({
      messagesByAgent: state.selectedAgent
        ? { ...state.messagesByAgent, [state.selectedAgent.id]: [] }
        : state.messagesByAgent
    }));
  },

  loadChatHistory: async (agentId) => {
    const messages = await db.getConversationHistory('user', agentId);
    set((state) => ({
      messagesByAgent: {
        ...state.messagesByAgent,
        [agentId]: messages
      }
    }));
  },

  startCall: async (phoneNumber: string, countryCode: string) => {
    const { selectedAgent } = useAgentStore.getState();
    
    // Check if BlandAI is explicitly disabled
    if (import.meta.env.VITE_DISABLE_BLAND_AI === 'true') {
      console.log('BlandAI is disabled. Simulating successful call.');
      // Simulate a successful call
      set({ isCallActive: true });
      // Reset call active state after 5 seconds for testing
      setTimeout(() => { 
        set({ isCallActive: false });
      }, 5000);
      
      return {
        success: true,
        message: 'BlandAI is disabled. Call simulation successful.'
      };
    }
    
    // Validate API configuration and agent
    if (!API_CONFIG.BLAND_AI_KEY || !API_CONFIG.BLAND_ORG_ID) {
      return {
        success: false,
        message: 'Voice synthesis module not configured. Please check your environment variables.'
      };
    }

    if (!selectedAgent) {
      return {
        success: false,
        message: 'No agent selected'
      };
    }
    
    if (!selectedAgent.config?.pathwayId) {
      return {
        success: false,
        message: 'Voice pathway not configured for this agent.'
      };
    }
    
    if (!selectedAgent.config?.phone) {
      return {
        success: false,
        message: 'Phone number not configured for this agent. Please check agent configuration.'
      };
    }

    try {
      const result = await blandAI.initiateCall(phoneNumber, countryCode, selectedAgent);
      
      if (result.success) {
        set({ isCallActive: true });
        // Reset call active state after 5 seconds for testing
        setTimeout(() => { 
          set({ isCallActive: false });
        }, 5000);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to establish quantum connection. Please verify your credentials and try again.';

      console.error('Call initiation error:', error);

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  endCall: () => {
    set({ isCallActive: false });
  },

  getCallStatus: async () => {
    // Implement call status checking logic here
    // For now, return a mock status
    return 'in-progress';
  }
}));