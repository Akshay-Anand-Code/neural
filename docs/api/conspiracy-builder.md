# Conspiracy Builder API

## Overview

The Conspiracy Builder API provides access to AI-powered conspiracy theory generation and analysis capabilities. It combines real-time data analysis with neural pattern matching to create engaging conspiratorial narratives.

## Authentication

All API requests require an API key:
```bash
Authorization: Bearer px_your_api_key
```

## Rate Limits

- 60 requests per minute per API key
- Conspiracy generation limited to 10 requests per minute
- Rate limit headers included in responses

## Endpoints

### Generate Conspiracy

```typescript
POST /api/conspiracies/generate
```

Generates a new conspiracy theory based on provided context and parameters.

#### Request Body
```typescript
interface GenerateRequest {
  prompt: string;
  context?: {
    data?: Record<string, any>;
    topics?: string[];
    intensity?: number;
  };
  options?: {
    maxLength?: number;
    temperature?: number;
    format?: 'text' | 'json';
  };
}
```

#### Response
```typescript
interface GenerateResponse {
  success: boolean;
  data?: {
    conspiracy: string;
    analysis?: {
      topics: string[];
      connections: Array<{
        from: string;
        to: string;
        strength: number;
      }>;
      confidence: number;
    };
    sources?: Array<{
      type: string;
      reference: string;
      relevance: number;
    }>;
  };
  error?: string;
}
```

### Analyze Data Patterns

```typescript
POST /api/conspiracies/analyze
```

Analyzes data patterns to find potential conspiratorial connections.

#### Request Body
```typescript
interface AnalyzeRequest {
  data: Array<Record<string, any>>;
  options?: {
    minConfidence?: number;
    maxConnections?: number;
    analysisType?: 'basic' | 'deep' | 'quantum';
  };
}
```

#### Response
```typescript
interface AnalyzeResponse {
  success: boolean;
  data?: {
    patterns: Array<{
      description: string;
      confidence: number;
      evidence: string[];
    }>;
    connections: Array<{
      nodes: string[];
      strength: number;
      description: string;
    }>;
    anomalies: Array<{
      type: string;
      description: string;
      significance: number;
    }>;
  };
  error?: string;
}
```

### Share Conspiracy

```typescript
POST /api/conspiracies/share
```

Prepares and formats a conspiracy theory for social sharing.

#### Request Body
```typescript
interface ShareRequest {
  conspiracy: string;
  platform: 'twitter' | 'reddit' | 'facebook';
  options?: {
    format?: 'text' | 'image';
    hashtags?: string[];
    mentions?: string[];
  };
}
```

#### Response
```typescript
interface ShareResponse {
  success: boolean;
  data?: {
    formattedText: string;
    shareUrl: string;
    preview?: {
      text: string;
      image?: string;
    };
  };
  error?: string;
}
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages:

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: {
    message: string;
    location?: string;
    suggestion?: string;
  };
}
```

## Example Usage

### Generate a Conspiracy

```typescript
const generateConspiracy = async (prompt: string) => {
  const response = await fetch('/api/conspiracies/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      options: {
        temperature: 0.8,
        format: 'text'
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate conspiracy');
  }

  return response.json();
};
```

### Analyze Patterns

```typescript
const analyzePatterns = async (data: any[]) => {
  const response = await fetch('/api/conspiracies/analyze', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data,
      options: {
        minConfidence: 0.7,
        analysisType: 'quantum'
      }
    })
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
};
```

## Best Practices

1. Content Guidelines
   - Ensure generated content is entertaining but not harmful
   - Avoid sensitive topics
   - Include clear fiction disclaimers

2. Performance Optimization
   - Cache common patterns
   - Implement request batching
   - Use appropriate confidence thresholds

3. Error Handling
   - Implement retry logic
   - Handle timeouts gracefully
   - Provide user-friendly error messages

4. Security
   - Validate all inputs
   - Rate limit requests
   - Monitor for abuse

## Rate Limiting

The API implements a token bucket algorithm for rate limiting:

```typescript
interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
```

When rate limited, the API returns:
```typescript
{
  success: false,
  error: 'Rate limit exceeded',
  code: 'RATE_LIMIT',
  details: {
    resetIn: 30, // seconds
    limit: 60,
    type: 'minute'
  }
}
```