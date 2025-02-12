export const API_CONFIG = {
  BLAND_AI_KEY: import.meta.env.VITE_BLAND_AI_KEY || '',
  BLAND_ORG_ID: import.meta.env.VITE_BLAND_ORG_ID || '',
  VENICE_API_KEY: import.meta.env.VITE_VENICE_API_KEY || ''
} as const;