# Data Vault API

## Overview

The Data Vault API provides secure access to quantum data storage and analysis capabilities. It enables programmatic access to CSV data files with advanced filtering and search functionality.

## Authentication

All API requests require an API key passed in the Authorization header:
```bash
Authorization: Bearer px_your_api_key
```

API keys can be generated through the Data Vault interface or programmatically.

## Rate Limits

- 60 requests per minute per API key
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Endpoints

### List Available Files

```typescript
GET /api/files
```

Returns a list of available CSV files in the quantum data vault.

#### Response
```typescript
interface FileListResponse {
  success: boolean;
  data?: {
    files: Array<{
      name: string;
      size: string;
      lastModified: string;
    }>;
  };
  error?: string;
}
```

### Get File Contents

```typescript
GET /api/files/:filename
```

Retrieves the contents of a specific CSV file with optional filtering and pagination.

#### Query Parameters
- `page` (number, default: 1): Page number
- `pageSize` (number, default: 20): Items per page
- `filters` (object): Column-specific filters
  - Format: `filters[column]=value`

#### Response
```typescript
interface FileContentsResponse {
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
```

### Generate API Key

```typescript
POST /api/keys
```

Generates a new API key for accessing the Data Vault.

#### Response
```typescript
interface ApiKeyResponse {
  success: boolean;
  data?: {
    key: string;
    created: string;
    expiresAt?: string;
  };
  error?: string;
}
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages:

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
}
```

Common error codes:
- `401`: Invalid API key
- `403`: Rate limit exceeded
- `404`: File not found
- `422`: Invalid request parameters

## Example Usage

### JavaScript/TypeScript

```typescript
const fetchData = async (filename: string, filters?: Record<string, string>) => {
  const response = await fetch(`/api/files/${filename}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    params: {
      filters,
      page: 1,
      pageSize: 20
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return response.json();
};
```

### Python

```python
import requests

def fetch_data(filename, filters=None):
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    params = {
        'page': 1,
        'pageSize': 20,
        'filters': filters
    }
    
    response = requests.get(
        f'/api/files/{filename}',
        headers=headers,
        params=params
    )
    
    response.raise_for_status()
    return response.json()
```

## Security Considerations

1. API Key Protection
   - Store keys securely
   - Rotate keys regularly
   - Never expose keys in client-side code

2. Request Validation
   - Validate all inputs
   - Sanitize file paths
   - Use parameterized queries

3. Rate Limiting
   - Implement client-side throttling
   - Handle rate limit errors gracefully
   - Cache responses when appropriate

4. Error Handling
   - Never expose internal errors
   - Log security events
   - Implement retry logic