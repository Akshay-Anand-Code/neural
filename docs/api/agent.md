# Agent API

## Overview

The Agent API provides methods for managing and interacting with AI agents in Project X.

## Methods

### Select Agent

```typescript
async function selectAgent(id: string): Promise<void>
```

Selects an agent for interaction.

#### Parameters
- `id` (string): The unique identifier of the agent

#### Example
```typescript
await client.agent.selectAgent('donald-trump');
```

### Get Agent

```typescript
async function getAgent(id: string): Promise<Agent>
```

Retrieves agent details.

#### Parameters
- `id` (string): The unique identifier of the agent

#### Returns
- `Agent`: The agent object with all properties

#### Example
```typescript
const agent = await client.agent.getAgent('donald-trump');
```

### List Agents

```typescript
async function listAgents(): Promise<Agent[]>
```

Lists all available agents.

#### Returns
- `Agent[]`: Array of available agents

#### Example
```typescript
const agents = await client.agent.listAgents();
```

## Types

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

## Error Handling

```typescript
try {
  await client.agent.selectAgent('donald-trump');
} catch (error) {
  if (error instanceof AgentNotFoundError) {
    // Handle agent not found
  } else if (error instanceof AuthenticationError) {
    // Handle authentication error
  } else {
    // Handle other errors
  }
}
```

## Best Practices

1. Always check agent availability before selection
2. Handle agent state changes appropriately
3. Implement proper error recovery
4. Cache agent data when appropriate
5. Monitor agent performance metrics