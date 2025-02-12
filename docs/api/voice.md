# Voice API (Bland.AI Integration)

## Overview

Project X uses Bland.AI for voice synthesis and phone call capabilities. This integration enables real-time voice communication with AI agents.

## Configuration

```typescript
// Initialize Bland.AI service
const blandAI = new BlandAIService({
  apiKey: process.env.VITE_BLAND_AI_KEY,
  orgId: process.env.VITE_BLAND_ORG_ID
});
```

## Methods

### Start Call

```typescript
async function initiateCall(
  phoneNumber: string, 
  countryCode: string, 
  agent: Agent
): Promise<CallResult>
```

Initiates a phone call using Bland.AI.

#### Parameters
- `phoneNumber` (string): Target phone number
- `countryCode` (string): Country code
- `agent` (Agent): Selected agent configuration

#### Returns
```typescript
interface CallResult {
  success: boolean;
  message: string;
  callId?: string;
}
```

#### Example
```typescript
const result = await blandAI.initiateCall(
  '1234567890',
  '1',
  selectedAgent
);
```

### Get Call Status

```typescript
async function getCallStatus(callId: string): Promise<string>
```

Gets the current status of a call.

#### Parameters
- `callId` (string): The call ID from Bland.AI

#### Returns
- `string`: Current call status

#### Example
```typescript
const status = await blandAI.getCallStatus(callId);
```

## Call Status Types

```typescript
type CallStatus = 
  | 'queued'
  | 'initiated'
  | 'ringing'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'busy'
  | 'no-answer'
  | 'canceled';
```

## Error Handling

```typescript
try {
  const result = await blandAI.initiateCall(phone, countryCode, agent);
  if (!result.success) {
    throw new Error(result.message);
  }
} catch (error) {
  console.error('Call initiation error:', error);
  // Handle error appropriately
}
```

## Best Practices

1. Validate phone numbers before calling
2. Use proper country code format
3. Handle all possible call statuses
4. Implement timeouts for long-running calls
5. Monitor call quality and errors

## Rate Limiting

Implement rate limiting based on your Bland.AI plan:

```typescript
const rateLimiter = new RateLimiter({
  maxRequests: 60,
  windowMs: 60000
});

if (!rateLimiter.tryAcquire()) {
  throw new Error('Rate limit exceeded');
}
```