import { Agent } from '../types/agent';

export async function loadAgents(): Promise<Agent[]> {
  const agents: Agent[] = [];
  
  // Use Vite's import.meta.glob to dynamically load all agent files
  const agentModules = import.meta.glob('../agents/*.ts');
  
  for (const path in agentModules) {
    try {
      const module = await agentModules[path]();
      if (module.agent) {
        agents.push(module.agent);
      }
    } catch (error) {
      console.error(`Error loading agent from ${path}:`, error);
    }
  }
  
  return agents;
}