import type { User } from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('enosoft_auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  return await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function logout(): Promise<void> {
  await request<void>('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser(): Promise<User> {
  return await request<User>('/auth/me');
}

export async function refreshToken(): Promise<AuthResponse> {
  return await request<AuthResponse>('/auth/refresh', {
    method: 'POST',
  });
}
