# Project X API Reference

## Overview

Project X exposes a set of APIs for interacting with the core system. The main APIs are:

- [Agent API](./agent.md) - Manage AI agents and personalities
- [Message API](./message.md) - Handle real-time messaging
- [Voice API](./voice.md) - Control voice synthesis and calls
- [Venice API](./venice.md) - Access language model capabilities
- [WebSocket API](./websocket/connection.md) - Real-time communication

## Core APIs

### Agent Management

The agent system is managed through Zustand store:

```typescript
const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  selectedAgent: null,
  messages: [],
  isCallActive: false,

  // Select an agent
  selectAgent: (id: string) => {
    set((state) => ({
      selectedAgent: state.agents.find(agent => agent.id === id) || null,
      messages: []
    }));
  },

  // Load available agents
  loadAgents: async () => {
    const agents = await loadAgents();
    set({ agents });
  }
}));
```

### Message Handling

Messages are handled through the agent store:

```typescript
// Send message
const handleMessage = async (message: Message) => {
  await addMessage({
    id: crypto.randomUUID(),
    agentId: selectedAgent.id,
    content: message.content,
    timestamp: new Date(),
    type: 'user'
  });
};

// Get conversation history
const loadChatHistory = async (agentId: string) => {
  const messages = await db.getConversationHistory('user', agentId);
  set({ messages });
};
```

### Voice Integration with Bland.AI

Voice calls are handled through our Voice API powered by Bland.AI:

```typescript
// Start a call
const startCall = async (phoneNumber: string, countryCode: string) => {
  if (!selectedAgent) {
    return {
      success: false,
      message: 'No agent selected'
    };
  }

  try {
    const result = await blandAI.initiateCall(phoneNumber, countryCode, selectedAgent);
    
    if (result.success) {
      set({ isCallActive: true });
    }
    
    return result;
  } catch (error) {
    console.error('Error in startCall:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start call'
    };
  }
};
```

## Environment Variables

- `VITE_VENICE_API_KEY` - Venice.ai API key for language model access
- `VITE_OPENAI_EMBEDDINGS_KEY` - OpenAI API key for embeddings
- `VITE_BLAND_AI_KEY` - Bland.AI key for voice synthesis
- `VITE_BLAND_ORG_ID` - Bland.AI organization ID
- `VITE_ACCESS_PASSWORD` - Access password for the app

## Error Handling

```typescript
try {
  await addMessage(message);
} catch (error) {
  if (error instanceof RateLimitError) {
    // Handle rate limiting
  } else if (error instanceof AuthError) {
    // Handle auth issues
  } else {
    // Handle other errors
  }
}
```

## Rate Limits

- Bland.AI: Refer to your plan limits
- OpenAI: Default tier limits apply for embeddings
- Local rate limiting: 60 requests per minute implemented via RateLimiter utility

## Types

### Message Interface

```typescript
interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'agent';
}
```

### Agent Interface

```typescript
interface Agent {
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
```

## Best Practices

1. Always check for selected agent before operations
2. Implement proper error handling
3. Use rate limiting where appropriate
4. Cache responses when possible
5. Monitor API usage and errors