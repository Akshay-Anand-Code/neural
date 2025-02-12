interface AICharacter {
  id: string;
  name: string;
  personality: string;
  traits: string[];
}

const SIMILARITY_THRESHOLD = 0.8;

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  return dotProduct / (normA * normB);
}

export function enhancePrompt(
  message: string,
  embeddings: number[],
  character: AICharacter
): string {
  // For now, we'll just return the original message since we don't have a context database
  // In a full implementation, we would:
  // 1. Maintain a database of previous conversations and their embeddings
  // 2. Find similar contexts using cosine similarity
  // 3. Include relevant context in the enhanced prompt
  
  return message;
}