import OpenAI from 'openai';
import type { ChatOptions } from '../types/venice';
// import { API_CONFIG } from '../config/api';

class OpenAIService {
  private client?: OpenAI;
  private model = import.meta.env.VITE_VENICE_MODEL || 'gpt-4o-mini';

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_EMBEDDINGS_KEY;
    if (!apiKey) {
      console.error('OpenAI API key is missing. Please set VITE_OPENAI_EMBEDDINGS_KEY in your environment variables.');
      return;
    }

    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async chat(message: string, options: ChatOptions): Promise<string> {
    try {
      if (!this.client) {
        return "NEURAL INTERFACE ERROR: OpenAI API key not configured. Please check your environment variables.";
      }

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: `${options.systemPrompt}\n\nIMPORTANT: Keep responses extremely concise (5-15 words). Maximum length: 220 characters.`
          },
          { role: 'user', content: message }
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 50,
        top_p: options.topP ?? 1,
        frequency_penalty: options.frequencyPenalty ?? 0,
        presence_penalty: options.presencePenalty ?? 0,
        stop: options.stop
      });

      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API request failed:', error);
      return "QUANTUM FIELD DISRUPTION: Communication temporarily unavailable. Please retry.";
    }
  }
}

export const openai = new OpenAIService();