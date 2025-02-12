import { Agent } from '../types/agent';
import { API_CONFIG } from '../config/api';
import * as donaldTrump from '../agents/donald-trump';
import * as elonMusk from '../agents/elon-musk';
import * as anonymousCollective from '../agents/anonymous-collective';
import * as doctorTerminus from '../agents/doctor-terminus';
import * as neoPrime from '../agents/neo-prime';
import * as reptilianPrime from '../agents/reptilian-prime';
import * as timeKeeper from '../agents/time-keeper';

export async function loadAgents(): Promise<Agent[]> {
  try {
    // Load static agents regardless of API configuration
    const agents: Agent[] = [
      donaldTrump.agent,
      elonMusk.agent,
      anonymousCollective.agent,
      doctorTerminus.agent,
      neoPrime.agent,
      reptilianPrime.agent,
      timeKeeper.agent
    ];

    // Log API status but don't block agent loading
    if (!API_CONFIG.VENICE_API_KEY) {
      console.warn('Venice API key is missing. Some agent features may be limited.');
    }

    if (agents.length === 0) {
      throw new Error('Failed to load any agents');
    }

    console.info(`Successfully loaded ${agents.length} agents`);
    return agents;

  } catch (error) {
    console.error('Error loading agents:', error instanceof Error ? error.message : error);
    // Return static agents as fallback even if there's an error
    return [
      donaldTrump.agent,
      elonMusk.agent,
      anonymousCollective.agent,
      doctorTerminus.agent,
      neoPrime.agent,
      reptilianPrime.agent,
      timeKeeper.agent
    ];
  }
}