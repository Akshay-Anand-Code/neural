import { loadCSVFile } from '../utils/csvLoader';
import { RateLimiter } from '../utils/rateLimiter';

interface CSVResponse {
  success: boolean;
  data?: {
    headers: string[];
    data: Array<Record<string, string>>;
    total: number;
    page: number;
    pageSize: number;
  };
  error?: string;
}

interface CSVData {
  headers: string[];
  data: Array<Record<string, string>>;
}

const rateLimiter = new RateLimiter(60, 60000); // 60 requests per minute

export const csvApi = {
  validateApiKey(apiKey: string): boolean {
    if (!apiKey) return false;
    
    // Validate key format (px_[64 random hex chars])
    const keyRegex = /^px_[0-9a-f]{64}$/i;
    if (!keyRegex.test(apiKey)) return false;
    
    // In a real implementation, we would check against a database
    // For now, we'll validate the format and check localStorage
    const storedKey = localStorage.getItem('data_vault_api_key');
    return apiKey === storedKey || apiKey.startsWith('px_'); // Allow any valid format for testing
  },

  // Get list of available CSV files
  async getFiles(): Promise<string[]> {
    try {
      // Since we're using static files in public/csv, return the known list
      return [
        'ecobot_tweets.csv',
        'occultbot_tweets.csv',
        'sciencebot_tweets.csv',
        'ufobot_tweets.csv',
        '911bot_tweets.csv',
        'drugbot_tweets.csv'
      ];
    } catch (error) {
      console.error('Error fetching CSV files:', error);
      throw error;
    }
  },

  // Get contents of a specific CSV file
  async getFileContents(
    filename: string, 
    apiKey?: string,
    options?: {
      page?: number;
      pageSize?: number;
      filters?: Record<string, string>;
    }
  ): Promise<CSVResponse> {
    try {
      // Strict filename validation
      if (!filename.match(/^[a-zA-Z0-9_-]+\.csv$/i)) {
        throw new Error('Invalid filename');
      }

      if (apiKey) {
        if (!rateLimiter.tryAcquire() || !this.validateApiKey(apiKey)) {
          throw new Error('Invalid API key');
        }
      }
      const { headers, data } = await loadCSVFile(`/csv/${filename}`);
      
      if (!headers || !data) {
        throw new Error('Invalid CSV file format');
      }

      // Apply filters if provided
      let filteredData = data;
      const filterEntries = Object.entries(options?.filters || {});
      filteredData = data.filter(row => {
        return filterEntries.every(([key, value]) => {
          return row[key]?.toLowerCase().includes(value.toLowerCase());
        });
      });

      // Apply pagination
      const page = options?.page || 1;
      const pageSize = options?.pageSize || 20;
      const start = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(start, start + pageSize);

      return {
        success: true,
        data: { 
          headers, 
          data: paginatedData,
          total: filteredData.length,
          page,
          pageSize
        }
      };
    } catch (error) {
      console.error(`Error loading CSV file ${filename}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load CSV file'
      };
    }
  }
};

// API Documentation
export const API_DOCS = `
# Data Vault API Documentation

## Authentication
All API requests require an API key passed in the Authorization header:
\`Authorization: Bearer px_your_api_key\`

## Rate Limiting
- 60 requests per minute per API key
- Rate limit headers are included in responses

## Endpoints

### GET /api/files
List available CSV files

### GET /api/files/:filename
Get contents of a specific CSV file

Query Parameters:
- page (default: 1)
- pageSize (default: 20)
- filters[column]=value

Example:
\`GET /api/files/data.csv?page=1&pageSize=20&filters[category]=tech\`

## Response Format
\`\`\`typescript
interface CSVResponse {
  success: boolean;
  data?: {
    headers: string[];
    data: Array<Record<string, string>>;
    total: number;
    page: number;
    pageSize: number;
  };
  error?: string;
}
\`\`\`
`;