import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_EMBEDDINGS_KEY,
  dangerouslyAllowBrowser: true
});

export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
      encoding_format: "float"
    });

    // Return the embeddings array from the first result
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error getting embeddings:', error);
    // Return zero vector as fallback (3072 dimensions for text-embedding-3-large)
    return new Array(3072).fill(0);
  }
}