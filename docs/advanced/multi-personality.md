# Multi-Personality Mode

## Overview

Project X's multi-personality system enables dynamic character switching and consistent narrative generation across different personas.

## Implementation

### Character Selection

```typescript
import { PersonalityManager } from '@project-x/core';

const manager = new PersonalityManager({
  defaultPersonality: 'donald-trump',
  contextAwareness: true
});

// Switch personality
await manager.switchTo('elon-musk', {
  context: 'mars-colonization',
  intensity: 0.8
});
```

### Personality Traits

Define character traits and behaviors:

```typescript
interface Personality {
  id: string;
  traits: string[];
  speech: SpeechPattern;
  triggers: string[];
  responses: ResponsePattern[];
}

const trumpPersonality: Personality = {
  id: 'donald-trump',
  traits: ['authoritative', 'conspiratorial'],
  speech: {
    pattern: 'repetitive',
    emphasis: 'strong',
    catchphrases: [...]
  },
  triggers: ['deep-state', 'election'],
  responses: [...]
};
```

## Best Practices

1. Maintain consistency
2. Handle transitions
3. Track context
4. Monitor performance
5. Regular calibration

## Configuration

```yaml
personality:
  switching_delay: 1000
  context_retention: true
  trait_blending: false
  response_cache: true
```

## Advanced Features

### Personality Blending

```typescript
// Blend multiple personalities
const blendedPersonality = await manager.blend([
  { id: 'donald-trump', weight: 0.7 },
  { id: 'elon-musk', weight: 0.3 }
]);
```

### Context Awareness

```typescript
// Update context
await manager.updateContext({
  market: 'bearish',
  sentiment: 'fearful',
  timeline: 'divergent'
});
```

### Response Generation

```typescript
// Generate contextual response
const response = await manager.generateResponse({
  input: 'What about the deep state?',
  context: currentContext,
  personality: currentPersonality
});
```