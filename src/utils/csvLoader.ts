import Papa from 'papaparse';

export async function loadCSVFile(filename: string, signal?: AbortSignal): Promise<{
  headers: string[];
  data: Array<Record<string, string>>;
}> {
  try {
    const response = await fetch(filename, { signal });
    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }
    
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          resolve({
            headers: results.meta.fields || [],
            data: results.data as Array<Record<string, string>>
          });
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`Error loading CSV file ${filename}:`, error);
    throw error;
  }
}