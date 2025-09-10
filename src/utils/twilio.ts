import { venice } from './venice';
import type { Agent } from '../types/agent';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export class TwilioService {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;
  private baseUrl = 'https://api.twilio.com/2010-04-01';

  constructor(config: TwilioConfig) {
    this.accountSid = config.accountSid;
    this.authToken = config.authToken;
    this.fromNumber = config.fromNumber;
  }

  private async generateConspiracyTheory(agent: Agent): Promise<string> {
    const prompt = `Generate a short, dramatic conspiracy theory (30-60 seconds when spoken) that matches my character's beliefs and personality. The theory should be engaging and end with a dramatic revelation or warning.

Current events or topics to reference:
- Quantum computing advancements
- AI development
- Social media influence
- Global financial systems
- Space exploration
- Climate change

Make it sound natural for verbal delivery, using my speech patterns and catchphrases.`;

    try {
      const response = await venice.chat(prompt, {
        systemPrompt: JSON.stringify(agent),
        temperature: 0.9,
        maxTokens: 250
      });

      return response;
    } catch (error) {
      console.error('Error generating conspiracy theory:', error);
      return 'I apologize, but I am unable to share this classified information at the moment. The quantum interference is too strong. We will try to establish contact again later.';
    }
  }

  private async createTwiMLResponse(message: string): Promise<string> {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="neural" language="en-US">
    ${message}
  </Say>
  <Pause length="1"/>
  <Say voice="neural" language="en-US">
    This message will self-destruct. Stay vigilant.
  </Say>
</Response>`;

    return twiml;
  }

  async initiateCall(phoneNumber: string, agent: Agent): Promise<{ success: boolean; message: string; callSid?: string }> {
    try {
      // Generate conspiracy theory for the agent
      const conspiracyTheory = await this.generateConspiracyTheory(agent);
      
      // Create TwiML for the call
      const twiml = await this.createTwiMLResponse(conspiracyTheory);

      // Encode credentials for Basic Auth
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

      // Make request to Twilio API
      const response = await fetch(`${this.baseUrl}/Accounts/${this.accountSid}/Calls.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: phoneNumber,
          From: this.fromNumber,
          Twiml: twiml,
          StatusCallback: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/call-status`,
          StatusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'].join(','),
          StatusCallbackMethod: 'POST'
        })
      });

      if (!response.ok) {
        throw new Error(`Twilio API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        message: 'Call initiated successfully',
        callSid: data.sid
      };

    } catch (error) {
      console.error('Error initiating call:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to initiate call'
      };
    }
  }

  async getCallStatus(callSid: string): Promise<string> {
    try {
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
      
      const response = await fetch(`${this.baseUrl}/Accounts/${this.accountSid}/Calls/${callSid}.json`, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get call status: ${response.statusText}`);
      }

      const data = await response.json();
      return data.status;

    } catch (error) {
      console.error('Error getting call status:', error);
      throw error;
    }
  }
}