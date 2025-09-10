// Main API service with HTTP client configuration

import type { ApiResponse, ApiError, RequestConfig } from '../types/api';
import { storage } from '../utils/storage';

// Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';
const DEFAULT_TIMEOUT = 10000;
const MAX_RETRIES = 3;

// Custom error class for API errors
export class ApiErrorClass extends Error {
  public code: string;
  public details?: Record<string, any>;
  public timestamp: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiError';
    this.code = error.code;
    this.details = error.details;
    this.timestamp = error.timestamp;
  }
}

// HTTP Client class
class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeaders(): Record<string, string> {
    const token = storage.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { headers = {}, timeout = DEFAULT_TIMEOUT, retries = MAX_RETRIES, ...fetchOptions } = options;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...headers,
    };

    let lastError: Error = new Error('Unknown error');

    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          headers: requestHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle HTTP errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            code: 'HTTP_ERROR',
            message: `HTTP ${response.status}: ${response.statusText}`,
            timestamp: new Date().toISOString(),
          }));

          throw new ApiErrorClass(errorData);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on auth errors or client errors (4xx)
        if (error instanceof ApiErrorClass && error.code.startsWith('4')) {
          throw error;
        }

        // Don't retry on abort (timeout)
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new ApiErrorClass({
            code: 'TIMEOUT_ERROR',
            message: 'Request timeout',
            timestamp: new Date().toISOString(),
          });
        }

        // Only retry on network errors or 5xx errors
        if (attempt === retries) {
          break;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    // If we get here, all retries failed
    throw new ApiErrorClass({
      code: 'NETWORK_ERROR',
      message: lastError?.message || 'Network request failed',
      timestamp: new Date().toISOString(),
    });
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', ...config });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', ...config });
  }
}

// Create and export the HTTP client instance
export const httpClient = new HttpClient(API_BASE_URL);

// Utility functions for common API patterns
export const apiUtils = {
  // Handle API response and extract data
  handleResponse: <T>(response: ApiResponse<T>): T => {
    if (!response.success) {
      throw new ApiErrorClass({
        code: 'API_ERROR',
        message: response.error || 'API request failed',
        timestamp: new Date().toISOString(),
      });
    }
    return response.data;
  },

  // Create error handler for async operations
  createErrorHandler: (fallback?: () => void) => (error: Error) => {
    console.error('API Error:', error);
    
    if (error instanceof ApiErrorClass) {
      // Handle specific API errors
      if (error.code === '401' || error.code === 'UNAUTHORIZED') {
        // Clear auth data and redirect to login
        storage.clearAuth();
        window.location.pathname = '/login';
        return;
      }
    }

    // Call fallback if provided
    if (fallback) {
      fallback();
    }

    // Re-throw error for component handling
    throw error;
  },
};