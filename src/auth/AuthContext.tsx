import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types/models';
import * as authService from './authService';
import { getToken, setToken, removeToken } from './tokenStorage';
import { verifyToken } from './jwtUtils';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    try {
      const token = getToken();
      if (token) {
        const payload = verifyToken(token);
        if (payload) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } else {
          removeToken();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      removeToken();
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await authService.login({ email, password });
    setToken(response.token);
    setUser(response.user);
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      setUser(null);
    }
  }

  async function register(email: string, password: string) {
    const response = await authService.register({ email, password });
    setToken(response.token);
    setUser(response.user);
  }

  async function refreshToken() {
    const response = await authService.refreshToken();
    setToken(response.token);
    setUser(response.user);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
