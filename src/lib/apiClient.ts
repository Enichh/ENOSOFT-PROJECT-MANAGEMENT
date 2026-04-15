import { useAuthStore } from '../stores/authStore';

class ApiClient {
  private baseUrl: string;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/.netlify/functions';
  }

  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().token;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryRequest(requestFn, retries - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('timeout')
      );
    }
    return false;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<T>(response);
    });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.retryRequest(async () => {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<T>(response);
    });
  }
}

export const api = new ApiClient();
