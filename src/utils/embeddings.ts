import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_EMBEDDINGS_KEY;

if (!API_KEY) {
  console.error('OpenAI API key is missing');
}

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float"
    });

    // Return the embeddings array from the first result
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error getting embeddings:', error);
    // Return zero vector as fallback (1536 dimensions for text-embedding-3-small)
    return new Array(1536).fill(0);
  }
}