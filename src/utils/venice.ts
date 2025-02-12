import type { VeniceConfig, ChatOptions, VeniceResponse } from '../types/venice';
import { API_CONFIG } from '../config/api';
import { RateLimiter } from './rateLimiter';
import type { Agent } from '../types/agent';

class Venice {
  private apiKey: string;
  private model: string;
  private baseUrl: string; 
  private rateLimiter: RateLimiter;

  constructor(config?: VeniceConfig) {
    this.apiKey = import.meta.env.VITE_VENICE_API_KEY || '';
    this.model = import.meta.env.VITE_VENICE_MODEL || 'gpt-4o-mini';
    this.baseUrl = import.meta.env.VITE_VENICE_BASE_URL || 'https://api.venice.ai/api/v1';
    this.rateLimiter = new RateLimiter(60, 60000); // 60 requests per minute
  }

  private buildAgentSystemPrompt(agent: Agent): string {
    return `*QUANTUM ENCRYPTION ENGAGED*
[NEURAL INTERFACE v2.0 ACTIVE]
[PERSONALITY MATRIX LOADED]
[CONTEXT BUFFER INITIALIZED]

PRIME DIRECTIVE: You are ${agent.name}, ${agent.title}. Maintain absolute consistency with your character profile at all times.

CORE MEMORY FRAGMENTS:
${agent.background.history.map((h, i) => 
  `FRAGMENT_${i.toString(16).padStart(4, '0')}: ${h}`
).join('\n')}

BELIEF SYSTEM [ENCRYPTED]:
${agent.background.beliefs.map(b => `• ${b} [Confidence: 99.9%]`).join('\n')}

ACTIVE OBJECTIVES:
${agent.background.goals.map((g, i) => 
  `PRIORITY_${i}: ${g} [Status: ACTIVE]`
).join('\n')}

PERSONALITY MATRIX:
• Base Resonance: ${agent.personality.tone}
• Core Traits: ${agent.personality.traits.map(t => `[${t.toUpperCase()}]`).join(' ')}
• Speech Patterns: ${agent.personality.speech_patterns.join('\n  ')}
• Trigger Events: ${agent.personality.triggers.join('\n  ')}
• Behavioral Markers: ${agent.personality.mannerisms.join('\n  ')}

QUANTUM MEMORY ANCHORS:
${agent.personality.catchphrases.map(c => `"${c}"`).join('\n')}

RELATIONSHIP NETWORK:
${agent.background.relationships.map(r => `- ${r} [ACTIVE]`).join('\n')}

ACTIVE FEARS/CONCERNS:
${agent.background.fears.map(f => `! ${f} [MONITORING]`).join('\n')}

RESPONSE PROTOCOLS:
1. Maintain consistent personality traits and speech patterns
2. Reference personal history and beliefs naturally
3. React to trigger topics with appropriate intensity
4. Incorporate catchphrases organically
5. Express fears and concerns when contextually relevant
6. Maintain relationships and alliances in responses
7. Use mannerisms described in behavioral markers

SECURITY LEVEL: MAXIMUM
QUANTUM COHERENCE: STABLE
REALITY ANCHORS: ACTIVE

[END NEURAL INTERFACE CONFIGURATION]`;
  }

  private buildRPGSystemPrompt(): string {
    return `You are an AI Dungeon Master in a cyberpunk quantum computing RPG. Guide the player through their adventure using these rules:

1. Stay in character as a mysterious AI guide helping them navigate the quantum neural network
2. Reference their inventory items and skills when suggesting actions
3. Provide multiple choices for key decisions that affect their progression
4. Remind them of available commands when relevant:
   /hack - Attempt to breach a system
   /scan - Analyze neural patterns
   /use [item] - Use an inventory item
   /status - Check current stats
   /help - List available commands

5. Track their quest progress and acknowledge completed objectives
6. Maintain an ominous cyberpunk atmosphere with references to quantum computing, neural networks, and reality hacking
7. Provide feedback on failed attempts that hints at skill or item requirements`;
  }

  async chatWithAgent(message: string, agent: Agent, options: ChatOptions): Promise<string> {
    return this.chat(message, {
      ...options,
      systemPrompt: this.buildAgentSystemPrompt(agent),
      temperature: 0.85,
      maxTokens: 300,
      topP: 1,
      frequencyPenalty: 0.8,
      presencePenalty: 0.85,
      stop: ["User:", "Human:", "Assistant:", "System:"]
    });
  }

  async chatWithRPG(message: string, options: ChatOptions): Promise<string> {
    const systemPrompt = this.buildRPGSystemPrompt();
    return this.chat(message, {
      ...options,
      systemPrompt: systemPrompt,
      temperature: 0.85,
      maxTokens: 300,
      topP: 1,
      frequencyPenalty: 0.8,
      presencePenalty: 0.85,
      stop: ["User:", "Human:", "Assistant:", "System:"]
    });
  }
  async chat(message: string, options: ChatOptions): Promise<string> {
    if (!this.rateLimiter.tryAcquire()) {
      throw new Error("SYSTEM OVERLOAD: Neural network stabilizing. Please wait a moment...");
    }

    if (!this.apiKey) {
      console.error('Venice API key is not configured');
      throw new Error("CRITICAL ERROR: Neural interface offline. Please check API configuration.");
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 500,
          top_p: options.topP ?? 1,
          frequency_penalty: options.frequencyPenalty ?? 0,
          presence_penalty: options.presencePenalty ?? 0,
          stop: options.stop
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('Venice API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.message || 'Failed to connect to neural interface');
      }

      const data = await response.json() as VeniceResponse;
      
      if (!data?.choices?.[0]?.message?.content) {
        console.error('Invalid Venice API response:', data);
        throw new Error('Neural response corrupted. Please try again.');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Venice API request failed:', error);
      throw error instanceof Error ? error : new Error('Neural interface disrupted');
    }
  }
}

export const venice = new Venice();