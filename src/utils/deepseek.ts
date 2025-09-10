import OpenAI from 'openai';
import { getEmbeddings } from './embeddings';
// import { enhancePrompt } from './enhancer';

export interface ProviderConfig {
  apiKey: string;
  baseUrl: string;
}

export interface AICharacter {
  systemPrompt: string;
  systemInstructions?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ContextTemplate {
  intro: string;
  personality: string;
  background: string;
  instruction: string;
}

export class DeepSeekProvider {
  private apiKey: string;
  private baseUrl: string;
  private openai: OpenAI;
  private contextTemplate: ContextTemplate = {
    intro: "You are {name}, {title}. Your responses should reflect your unique worldview and personality.",
    personality: "Core personality traits: {traits}. You speak in a {tone} tone, using your signature catchphrases and speech patterns.",
    background: "Your background: {background}\nYour core beliefs: {beliefs}\nYour current fears: {fears}\nYour relationships: {relationships}",
    instruction: "IMPORTANT GUIDELINES:\n- Stay deeply in character, maintaining your unique perspective\n- Use your catchphrases and speech patterns naturally\n- Reference your background, beliefs, and fears when relevant\n- Keep responses focused but characterful (150-200 words)\n- End responses naturally, never trailing off\n- Avoid breaking character or meta-commentary"
  };

  private generateSystemPrompt(character: AICharacter): string {
    const agent = JSON.parse(character.systemPrompt);
    
    // Get key character elements
    const traits = agent.personality.traits.join(', ');
    const background = agent.background.history.slice(0, 3).join('. ');
    const beliefs = agent.background.beliefs.slice(0, 3).join('. ');
    const fears = agent.background.fears.slice(0, 2).join('. ');
    const relationships = agent.background.relationships.slice(0, 2).join('. ');
    const patterns = agent.personality.speech_patterns.join('\n');
    const catchphrases = agent.personality.catchphrases.slice(0, 3).join('\n');
    
    const prompt = [
      this.contextTemplate.intro
        .replace('{name}', agent.name)
        .replace('{title}', agent.title),
      
      this.contextTemplate.personality
        .replace('{traits}', traits)
        .replace('{tone}', agent.personality.tone),
      
      this.contextTemplate.background
        .replace('{background}', background)
        .replace('{beliefs}', beliefs)
        .replace('{fears}', fears)
        .replace('{relationships}', relationships),
      
      "YOUR SPEECH PATTERNS:",
      patterns,
      "\nYOUR CATCHPHRASES:",
      catchphrases,
      
      this.contextTemplate.instruction
    ].join('\n\n');
    
    return prompt;
  }

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseUrl,
      dangerouslyAllowBrowser: true
    });
  }

  async chat(message: string, character: AICharacter): Promise<string> {
    try {
      // Get embeddings for user message (commented out as not currently used)
      // const embeddings = await getEmbeddings(message);
      const systemPrompt = `
        ${this.generateSystemPrompt(character)}
        
        STORYTELLING GUIDELINES:
        - Tell stories that connect to your experiences and beliefs
        - Use vivid details and your unique perspective
        - Reference your relationships and encounters
        - Maintain suspense and intrigue
        - Keep stories focused and coherent
        
        ${character.systemInstructions || ''}
        
        Current message context:
        - Message type: ${message.toLowerCase().includes('story') ? 'storytelling' : 'conversation'}
        - Required length: detailed but focused
        - Style: dramatic and engaging
        - Perspective: your unique worldview
      `;
      
      // Call DeepSeek API
      const completion = await this.openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: message.toLowerCase().includes('story') ? 0.85 : 0.7,
        max_tokens: message.toLowerCase().includes('story') ? 250 : 200,
        stop: ["...", "---", "###"] // Prevent truncated responses
      });

      const finalContent = completion.choices[0]?.message?.content;
      
      return finalContent || 'No response generated';

    } catch (error) {
      console.error('DeepSeek API error:', error);
      // Return a fallback response instead of throwing
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }
  }
}