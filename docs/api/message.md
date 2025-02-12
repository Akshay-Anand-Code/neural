# Message API

## Overview

The Message API enables real-time communication with AI agents through text messages.

## Methods

### Send Message

```typescript
async function sendMessage(message: Message): Promise<void>
```

Sends a message to the selected agent.

#### Parameters
- `message` (Message): The message object to send

#### Example
```typescript
await client.message.sendMessage({
  id: crypto.randomUUID(),
  agentId: 'donald-trump',
  content: 'Tell me about the quantum timeline',
  timestamp: new Date(),
  type: 'user'
});
```

### Get History

```typescript
async function getHistory(agentId: string): Promise<Message[]>
```

Retrieves conversation history with an agent.

#### Parameters
- `agentId` (string): The agent's unique identifier

#### Returns
- `Message[]`: Array of messages in chronological order

#### Example
```typescript
const history = await client.message.getHistory('donald-trump');
```

### Clear History

```typescript
function clearHistory(): void
```

Clears the conversation history.

#### Example
```typescript
client.message.clearHistory();
```

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

## Error Handling

```typescript
try {
  await client.message.sendMessage(message);
} catch (error) {
  if (error instanceof MessageDeliveryError) {
    // Handle message delivery failure
  } else if (error instanceof RateLimitError) {
    // Handle rate limiting
  } else {
    // Handle other errors
  }
}
```

## Best Practices

1. Implement proper message queuing
2. Handle rate limiting appropriately
3. Store message history locally
4. Implement retry logic for failed messages
5. Monitor message delivery status