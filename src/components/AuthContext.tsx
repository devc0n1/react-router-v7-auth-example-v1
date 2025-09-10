import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
import type { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = storage.getToken();
        if (token) {
          // Validate token and get user data
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid auth data
        storage.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login({ username, password });
      
      // Store auth data
      storage.setToken(response.token);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);
      
      // Update user state
      setUser(response.user);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of API call result
      setUser(null);
      storage.clearAuth();
      setLoading(false);
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken({ refreshToken });
      
      // Update stored auth data
      storage.setToken(response.token);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);
      
      // Update user state
      setUser(response.user);
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear auth data on refresh failure
      setUser(null);
      storage.clearAuth();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};