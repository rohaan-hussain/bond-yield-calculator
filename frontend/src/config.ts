export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
} as const;
