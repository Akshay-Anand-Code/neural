# API Reference

## Core APIs

### Agent Management

```typescript
interface AgentAPI {
  selectAgent(id: string): Promise<void>;
  getAgent(id: string): Promise<Agent>;
  listAgents(): Promise<Agent[]>;
}
```

### Message Handling

```typescript
interface MessageAPI {
  sendMessage(message: Message): Promise<void>;
  getHistory(agentId: string): Promise<Message[]>;
  clearHistory(): void;
}
```

### Voice Integration

```typescript
interface VoiceAPI {
  startCall(phone: string, countryCode: string): Promise<CallResult>;
  endCall(callId: string): Promise<void>;
  getCallStatus(callId: string): Promise<string>;
}
```

## WebSocket Events

### Connection

```typescript
ws.on('connect', () => {
  console.log('Connected to quantum network');
});
```

### Message Events

```typescript
ws.on('message', (data: MessageEvent) => {
  console.log('Received:', data);
});
```

### Timeline Events

```typescript
ws.on('timeline_shift', (data: TimelineEvent) => {
  console.log('Timeline shifted:', data);
});
```

## Error Handling

```typescript
try {
  await agent.sendMessage(message);
} catch (error) {
  if (error instanceof QuantumError) {
    // Handle quantum state errors
  } else if (error instanceof TimelineError) {
    // Handle timeline inconsistencies
  } else {
    // Handle other errors
  }
}
```

## Rate Limits

- 60 requests per minute per IP
- 1000 requests per day per API key
- 10 concurrent connections per client