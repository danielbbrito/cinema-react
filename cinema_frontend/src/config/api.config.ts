// API Configuration
// Uses VITE_API_URL environment variable if available, otherwise falls back to localhost
// Note: The browser makes API requests, so use localhost even in Docker
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();

