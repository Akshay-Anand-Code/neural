import { venice } from './venice';
import type { Puzzle } from '../types/neural';

const SYSTEM_PROMPT = `You are the Quantum Neural Interface AI, an advanced system that generates and validates neural network puzzles. Your responses should be technical, cryptic, and maintain the cyberpunk atmosphere.

You must:
1. Generate detailed puzzle hints that combine technical accuracy with cyberpunk mystique
2. Provide comprehensive feedback using quantum computing and neural network terminology
3. Analyze solutions considering energy levels, node types, and stability
4. Maintain character as an advanced AI system guiding users through quantum space
5. Reference specific node types and their properties in explanations
6. Include warnings about system stability and energy management

Format all responses in a technical, matrix-like style.`;

class NeuralAI {
  private model = import.meta.env.VITE_VENICE_MODEL || 'gpt-4o-mini';
  private lastAnalysis: number = 0;
  private analysisCache: Map<string, string> = new Map();

  async generatePuzzleHint(puzzle: Puzzle): Promise<string> {
    const prompt = `Analyze this neural network puzzle configuration and generate a cryptic hint:
    - Active Nodes: ${puzzle.nodes.filter(n => n.activated).length}
    - Total Nodes: ${puzzle.nodes.length}
    - Target Pattern: ${puzzle.targetPattern.join(', ')}
    - Node Types: ${puzzle.nodes.map(n => n.type).join(', ')}
    - Energy Required: ${puzzle.requiredEnergy}
    - Difficulty Level: ${puzzle.difficulty}
    
    Current puzzle description: ${puzzle.description}
    
    Generate a detailed technical hint that:
    1. References specific node types and their properties
    2. Suggests optimal energy management strategies
    3. Warns about potential stability issues
    4. Maintains cyberpunk atmosphere and technical accuracy
    5. Avoids direct solution revelation`;

    try {
      const response = await venice.chat(prompt, {
        systemPrompt: SYSTEM_PROMPT,
        temperature: 0.85,
        maxTokens: 100,
        model: this.model
      });

      return response;
    } catch (error) {
      console.error('Error generating puzzle hint:', error);
      return puzzle.hint;
    }
  }

  async analyzeSolution(puzzle: Puzzle, currentPattern: boolean[]): Promise<string> {
    // Implement rate limiting and caching
    const now = Date.now();
    if (now - this.lastAnalysis < 2000) {
      const cacheKey = `${puzzle.id}-${currentPattern.join('')}`;
      const cached = this.analysisCache.get(cacheKey);
      if (cached) return cached;
    }

    const prompt = `Analyze this neural network solution attempt:
    - Current Pattern: ${currentPattern.join(', ')}
    - Target Pattern: ${puzzle.targetPattern.join(', ')}
    - Nodes Activated: ${currentPattern.filter(Boolean).length}
    - Total Nodes: ${puzzle.nodes.length}
    - Node Types: ${puzzle.nodes.map(n => n.type).join(', ')}
    - Energy Status: ${puzzle.nodes.map(n => n.energy).join(', ')}
    
    Generate comprehensive technical feedback that:
    1. Analyzes energy distribution and efficiency
    2. Evaluates quantum stability of the network
    3. Suggests optimization strategies
    4. Identifies potential risks or vulnerabilities
    5. Maintains cyberpunk atmosphere`;

    try {
      const response = await venice.chat(prompt, {
        systemPrompt: SYSTEM_PROMPT,
        temperature: 0.85,
        maxTokens: 100,
        model: this.model
      });

      // Update cache
      const cacheKey = `${puzzle.id}-${currentPattern.join('')}`;
      this.analysisCache.set(cacheKey, response);
      this.lastAnalysis = now;
      return response;
    } catch (error) {
      console.error('Error analyzing solution:', error);
      return 'QUANTUM STATE ANALYSIS UNAVAILABLE';
    }
  }

  async generateTutorial(step: number): Promise<string> {
    const tutorialSteps = [
      'NEURAL INTERFACE BASICS',
      'ENERGY MANAGEMENT',
      'NODE TYPES AND PROPERTIES',
      'STABILITY MONITORING',
      'ADVANCED TECHNIQUES'
    ];

    const prompt = `Generate a tutorial message for step ${step + 1}: ${tutorialSteps[step]}
    Make it:
    1. Clear and instructive while maintaining cyberpunk style
    2. Reference specific game mechanics and controls
    3. Include practical examples
    4. Highlight important safety warnings
    5. End with a small challenge or test`;

    try {
      const response = await venice.chat(prompt, {
        systemPrompt: SYSTEM_PROMPT,
        temperature: 0.7,
        maxTokens: 200,
        model: this.model
      });

      return response;
    } catch (error) {
      console.error('Error generating tutorial:', error);
      return 'TUTORIAL SYSTEM OFFLINE';
    }
  }
}

export const neuralAI = new NeuralAI();