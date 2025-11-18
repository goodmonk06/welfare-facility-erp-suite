import { API_URL } from './utils';

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data);
      }

      // Unwrap ApiResponse if present
      return data.data !== undefined ? data.data : data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError({
        statusCode: 500,
        message: 'Network error',
        error: 'NetworkError',
        timestamp: new Date().toISOString(),
        path: endpoint,
        method: options?.method || 'GET',
      });
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  error?: string;

  constructor(response: ErrorResponse) {
    const message = Array.isArray(response.message)
      ? response.message.join(', ')
      : response.message;
    super(message);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.timestamp = response.timestamp;
    this.path = response.path;
    this.method = response.method;
    this.error = response.error;
  }
}

export const apiClient = new ApiClient(API_URL);
