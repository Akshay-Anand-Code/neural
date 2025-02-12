# Venice.ai Integration

## Overview

Project X uses Venice.ai for advanced language model capabilities, enabling sophisticated AI agent responses and natural language understanding.

## Configuration

```typescript
import { Venice } from '@project-x/venice';

const venice = new Venice({
  apiKey: process.env.VITE_VENICE_API_KEY,
  model: process.env.VITE_VENICE_MODEL || 'gpt-4o-mini'
});
```

## Methods

### Chat Completion

```typescript
async function chat(
  message: string, 
  options: ChatOptions
): Promise<string>
```

Generates AI responses using Venice's language models.

#### Parameters
- `message` (string): The user's input message
- `options` (ChatOptions): Configuration options for the response

```typescript
interface ChatOptions {
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
}
```

#### Example
```typescript
const response = await venice.chat(
  'Tell me about the quantum timeline',
  {
    systemPrompt: 'You are a quantum-aware AI entity...',
    temperature: 0.7,
    maxTokens: 150
  }
);
```

## Rate Limiting

The service implements automatic rate limiting:

```typescript
const rateLimiter = new RateLimiter({
  maxRequests: 60,
  windowMs: 60000
});

if (!rateLimiter.tryAcquire()) {
  return "QUANTUM INTERFERENCE: Too many requests. Please wait...";
}
```

## Error Handling

```typescript
try {
  const response = await venice.chat(message, options);
} catch (error) {
  if (error instanceof RateLimitError) {
    // Handle rate limiting
  } else if (error instanceof AuthenticationError) {
    // Handle authentication issues
  } else {
    // Handle other errors
  }
}
```

## Response Types

```typescript
interface VeniceResponse {
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
```

## Best Practices

1. **API Key Security**
   - Store API keys securely in environment variables
   - Never expose keys in client-side code
   - Rotate keys regularly

2. **Rate Limiting**
   - Implement proper rate limiting
   - Cache responses when possible
   - Handle rate limit errors gracefully

3. **Error Handling**
   - Implement comprehensive error handling
   - Provide meaningful error messages
   - Log errors appropriately

4. **Response Processing**
   - Validate responses before use
   - Handle malformed responses gracefully
   - Implement retry logic for failed requests

5. **Performance**
   - Use appropriate token limits
   - Cache frequently used responses
   - Monitor API usage and costs

## Environment Variables

Required environment variables:

```bash
VITE_VENICE_API_KEY=your_venice_api_key
VITE_VENICE_MODEL=gpt-4o-mini
```

## Integration Example

Here's a complete example of integrating Venice.ai with an agent response system:

```typescript
import { Venice } from '@project-x/venice';
import type { Agent } from '../types/agent';

class AgentResponseSystem {
  private venice: Venice;
  
  constructor() {
    this.venice = new Venice({
      apiKey: process.env.VITE_VENICE_API_KEY,
      model: process.env.VITE_VENICE_MODEL
    });
  }

  async generateResponse(
    message: string, 
    agent: Agent
  ): Promise<string> {
    const systemPrompt = `You are ${agent.name}, ${agent.title}. 
      Maintain absolute consistency with your character profile.
      Background: ${agent.background.history.join('. ')}
      Beliefs: ${agent.background.beliefs.join('. ')}`;

    try {
      const response = await this.venice.chat(message, {
        systemPrompt,
        temperature: 0.85,
        maxTokens: 150,
        topP: 1,
        frequencyPenalty: 0.8,
        presencePenalty: 0.85
      });

      return response;
    } catch (error) {
      console.error('Venice API error:', error);
      return 'QUANTUM FIELD DISRUPTION: Unable to generate response';
    }
  }
}
```

## Security Considerations

1. **API Key Protection**
   - Use environment variables
   - Implement key rotation
   - Monitor for unauthorized usage

2. **Request Validation**
   - Validate all inputs
   - Sanitize user content
   - Implement request signing

3. **Response Validation**
   - Verify response integrity
   - Handle malformed responses
   - Implement content filtering

4. **Access Control**
   - Implement proper authentication
   - Use role-based access control
   - Monitor access patterns

## Monitoring

```typescript
venice.on('request', (stats) => {
  console.log('Request performance:', stats);
});

venice.on('error', (error) => {
  console.error('Venice error:', error);
});
```