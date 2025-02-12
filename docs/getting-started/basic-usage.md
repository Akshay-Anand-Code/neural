# Basic Usage

## Overview

Project X provides a futuristic interface for interacting with AI-powered digital personalities through holographic interfaces and natural conversations.

## Core Features

### 1. AI Agents

Access unique AI personalities:

```typescript
import { useAgentStore } from '../store/useAgentStore';

const { selectAgent, selectedAgent } = useAgentStore();

// Select an agent
selectAgent('donald-trump');
```

### 2. Chat Interface

Interact with agents through the chat interface:

```typescript
const { addMessage } = useAgentStore();

// Send a message
await addMessage({
  id: crypto.randomUUID(),
  agentId: selectedAgent.id,
  content: 'Tell me about the quantum conspiracy',
  timestamp: new Date(),
  type: 'user'
});
```

### 3. Voice Calls

Initiate voice calls with agents:

```typescript
const { startCall } = useAgentStore();

// Start a call
const result = await startCall(phoneNumber, countryCode);
```

## Examples

### Basic Chat Interaction

```typescript
// Select an agent
selectAgent('elon-musk');

// Send a message
await addMessage({
  id: crypto.randomUUID(),
  agentId: 'elon-musk',
  content: 'What do you know about the simulation?',
  timestamp: new Date(),
  type: 'user'
});
```

### Voice Call Setup

```typescript
// Initialize a call
const result = await startCall('1234567890', '1');

if (result.success) {
  console.log('Call initiated:', result.callId);
} else {
  console.error('Call failed:', result.message);
}
```

## Best Practices

1. **Agent Selection**
   - Choose appropriate agents for context
   - Maintain conversation continuity

2. **Message Handling**
   - Implement proper error handling
   - Monitor response times
   - Cache responses when appropriate

3. **Voice Integration**
   - Validate phone numbers
   - Handle call status updates
   - Implement fallback mechanisms

## Next Steps

- Explore [Advanced Features](../advanced/multi-personality.md)
- Learn about [Security Considerations](../advanced/security.md)
- Check [API Reference](../api-reference/index.md)