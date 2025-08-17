import type { Agent } from '../types/agent';

interface BlandAIConfig {
  apiKey: string;
  orgId: string;
  webhookSecret?: string;
}

class BlandAIService {
  private apiKey: string;
  private orgId: string;
  private webhookSecret: string;
  private baseUrl = 'https://api.bland.ai/v1';
  private disabled: boolean;

  constructor(config: BlandAIConfig) {
    // Clean and validate API key
    this.apiKey = config.apiKey?.trim() || '';
    this.orgId = config.orgId?.trim() || '';
    this.webhookSecret = config.webhookSecret || '';
    
    // Check if BlandAI should be disabled
    this.disabled = !this.apiKey || !this.orgId || import.meta.env.VITE_DISABLE_BLAND_AI === 'true';
    
    // Don't throw error if disabled
    if (!this.disabled && (!this.apiKey || !this.orgId)) {
      console.warn('BlandAI credentials missing. Voice features will be disabled.');
    }
  }

  private validatePhoneNumber(phoneNumber: string, countryCode: string): boolean {
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const cleanCountryCode = countryCode.replace(/\D/g, '');

    // Basic validation rules
    if (!cleanCountryCode) return false;
    if (cleanCountryCode.length > 4) return false;
    if (cleanNumber.length < 6 || cleanNumber.length > 15) return false;

    return true;
  }

  private formatPhoneNumber(phoneNumber: string, countryCode: string): string {
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const cleanCountryCode = countryCode.replace(/\D/g, '');

    // Format as E.164 standard: +[country code][number]
    return `+${cleanCountryCode}${cleanNumber}`;
  }

  private async generateConspiracyTheory(agent: Agent): Promise<string> {
    const prompt = `*whispers in encrypted frequencies* 
    
    LISTEN CAREFULLY, for the ${agent.title} speaks through quantum channels...
    
    ${agent.personality.catchphrases[Math.floor(Math.random() * agent.personality.catchphrases.length)]}
    
    *static interference* 
    
    ${agent.background.beliefs[Math.floor(Math.random() * agent.background.beliefs.length)]}
    
    URGENT: ${agent.background.goals[Math.floor(Math.random() * agent.background.goals.length)]}
    
    *transmission fragmenting*
    
    ${agent.personality.speech_patterns[Math.floor(Math.random() * agent.personality.speech_patterns.length)]}
    
    WARNING: ${agent.background.fears[Math.floor(Math.random() * agent.background.fears.length)]}
    
    *reality destabilizing*
    
    Remember: Some knowledge was meant to stay hidden in the quantum foam...
    
    *transmission ends*`;

    return prompt;
  }

  async initiateCall(phoneNumber: string, countryCode: string, agent: Agent): Promise<{ success: boolean; message: string; callId?: string }> {
    try {
      // Check if BlandAI is disabled
      if (this.disabled) {
        console.log('BlandAI is disabled. Simulating successful call.');
        return {
          success: true,
          message: 'BlandAI is disabled. Call simulation successful.',
          callId: 'mock-call-id'
        };
      }

      if (!this.apiKey || !this.orgId) {
        throw new Error('Voice synthesis module not configured. Please check your environment variables.');
      }

      if (!agent.config?.pathwayId) {
        throw new Error('Voice pathway not configured for this agent.');
      }

      // Validate phone number format
      if (!this.validatePhoneNumber(phoneNumber, countryCode)) {
        throw new Error('Invalid quantum frequency pattern (invalid phone number format)');
      }

      // Format the phone number to E.164 format
      const formattedNumber = this.formatPhoneNumber(phoneNumber, countryCode);

      // Always format from number with +1 prefix for US numbers
      const fromNumber = '+15755000991';

      // Generate the conversation prompt
      const requestBody: any = {
        phone_number: formattedNumber,
        from: fromNumber,
        model: 'enhanced',
        pathway_id: agent.config.pathwayId,
        organization_id: this.orgId
      };

      // Add voice if specified in agent config
      if (agent.config?.voice) {
        requestBody.voice = agent.config.voice;
      }

      const response = await fetch(`${this.baseUrl}/calls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: response.statusText || 'Unknown error',
          status: response.status
        }));

        console.error('BlandAI API Error:', {
          agent: agent.name,
          pathwayId: agent.config.pathwayId,
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication failed. Please verify your BlandAI API key and organization ID.');
        } else if (response.status === 404) {
          throw new Error('Invalid pathway ID or resource not found.');
        } else {
          throw new Error('Failed to establish quantum connection. Please try again.');
        }
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Quantum transmission initiated successfully',
        callId: data.call_id
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown quantum interference detected';
      console.error('Error initiating quantum transmission:', error);
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  async getCallStatus(callId: string): Promise<string> {
    try {
      // Check if BlandAI is disabled
      if (this.disabled) {
        console.log('BlandAI is disabled. Returning mock call status.');
        return 'completed';
      }
      
      if (!this.apiKey || !this.orgId) {
        throw new Error('Voice synthesis module not configured');
      }

      const response = await fetch(`${this.baseUrl}/calls/${callId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get quantum transmission status');
      }

      const data = await response.json();
      return data.status;

    } catch (error) {
      console.error('Error getting transmission status:', error);
      throw error;
    }
  }
}

// Initialize singleton instance with environment variables
export const blandAI = new BlandAIService({
  apiKey: import.meta.env.VITE_BLAND_AI_KEY || '',
  orgId: import.meta.env.VITE_BLAND_ORG_ID || '',
  webhookSecret: import.meta.env.VITE_BLAND_WEBHOOK_SECRET || ''
});