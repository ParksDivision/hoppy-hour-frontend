// api/client.ts - Enhanced version with better error handling
import axios, { AxiosError, AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Custom error class for API errors
export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Response interceptor type
interface ApiResponse<T = any> extends AxiosResponse<T> {
  data: T;
}

// Create axios instance with enhanced configuration
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Enable credentials if needed for authentication
  withCredentials: false,
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.params) {
        console.log('📤 Params:', config.params);
      }
    }

    // Add authorization header if token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response: ApiResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - (response.config.metadata?.startTime || 0);
      console.log(`✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`);
      
      // Log data size for large responses
      if (response.data && typeof response.data === 'object') {
        const dataSize = JSON.stringify(response.data).length;
        if (dataSize > 10000) { // Log if > 10KB
          console.log(`📊 Response size: ${(dataSize / 1024).toFixed(1)}KB`);
        }
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // Enhanced error handling
    const duration = Date.now() - (error.config?.metadata?.startTime || 0);
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`);
    }

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || data?.error || `Request failed with status ${status}`;
      const code = data?.code;
      const details = data?.details;

      // Log specific error types
      switch (status) {
        case 401:
          console.warn('🔒 Unauthorized - please check authentication');
          // Clear invalid token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
          break;
        case 403:
          console.warn('🚫 Forbidden - insufficient permissions');
          break;
        case 404:
          console.warn('🔍 Not Found - endpoint or resource not found');
          break;
        case 429:
          console.warn('⏰ Rate Limited - too many requests');
          break;
        case 500:
          console.error('💥 Server Error - internal server error');
          break;
        default:
          console.error(`🚨 HTTP Error ${status}:`, message);
      }

      throw new ApiError(message, status, code, details);
    } else if (error.request) {
      // Network error or no response
      console.error('🌐 Network Error: No response received');
      console.error('Request details:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      });

      // Check if it's a timeout
      if (error.code === 'ECONNABORTED') {
        throw new ApiError('Request timeout - the server took too long to respond', 408, 'TIMEOUT');
      }

      // Check if backend is unreachable
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new ApiError(
          'Unable to connect to server. Please check if the backend is running.',
          503,
          'CONNECTION_REFUSED'
        );
      }

      throw new ApiError('Network error - please check your connection', 0, 'NETWORK_ERROR');
    } else {
      // Request setup error
      console.error('⚙️ Request Setup Error:', error.message);
      throw new ApiError(`Request setup error: ${error.message}`, 0, 'SETUP_ERROR');
    }
  }
);

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Retry function for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry for certain error types
      if (error instanceof ApiError) {
        if ([400, 401, 403, 404, 422].includes(error.status)) {
          throw error; // Don't retry client errors
        }
      }

      if (attempt === maxRetries) {
        break; // Last attempt failed
      }

      // Exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`⏳ Retry attempt ${attempt}/${maxRetries} in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// Wrapper for making requests with automatic retry
export const apiRequest = {
  get: <T>(url: string, config?: any) => retryRequest(() => apiClient.get<T>(url, config)),
  post: <T>(url: string, data?: any, config?: any) => retryRequest(() => apiClient.post<T>(url, data, config)),
  put: <T>(url: string, data?: any, config?: any) => retryRequest(() => apiClient.put<T>(url, data, config)),
  delete: <T>(url: string, config?: any) => retryRequest(() => apiClient.delete<T>(url, config)),
  patch: <T>(url: string, data?: any, config?: any) => retryRequest(() => apiClient.patch<T>(url, data, config)),
};

// Connection status hook data (for React components)
export const getConnectionStatus = () => {
  return {
    baseURL: BASE_URL,
    isHealthy: false, // Will be updated by health checks
    lastChecked: null as Date | null,
  };
};

// Export types for use in components
export type { ApiError };

// Development helper to log all requests/responses
if (process.env.NODE_ENV === 'development') {
  console.log(`🔧 API Client configured with base URL: ${BASE_URL}`);
}

// Global error handler for unhandled promise rejections (optional)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason instanceof ApiError) {
      console.error('🚨 Unhandled API Error:', {
        message: event.reason.message,
        status: event.reason.status,
        code: event.reason.code,
        url: event.reason.details?.url
      });
    }
  });
}