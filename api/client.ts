// api/client.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors or handle them globally
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);