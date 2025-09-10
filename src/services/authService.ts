// Authentication API service

import type { LoginRequest, LoginResponse, User, RefreshTokenRequest } from '../types/api';
import { storage } from '../utils/storage';

// Mock API delay to simulate real network requests
const MOCK_DELAY = 1500;

// Mock user database
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin' as const,
    password: 'password', // In real app, this would be hashed
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user' as const,
    password: 'password',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: new Date().toISOString(),
  }
];

// Mock function to simulate API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

// Mock token generation
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: userId, 
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  }));
  const signature = btoa(`mock-signature-${userId}-${Date.now()}`);
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await mockDelay();

    // In a real application, this would make an actual HTTP request:
    // return apiUtils.handleResponse(await httpClient.post<LoginResponse>('/auth/login', credentials));

    // Mock authentication logic
    const user = MOCK_USERS.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = generateMockToken(user.id);
    const refreshToken = generateMockToken(`refresh-${user.id}`);

    const loginResponse: LoginResponse = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString(),
      },
      token,
      refreshToken,
      expiresIn: 86400, // 24 hours in seconds
    };

    return loginResponse;
  },

  // Refresh authentication token
  async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.post<LoginResponse>('/auth/refresh', request));

    // Mock refresh logic
    try {
      const payload = request.refreshToken.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const userId = decoded.sub.replace('refresh-', '');
      
      const user = MOCK_USERS.find(u => u.id === userId);
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      const newToken = generateMockToken(user.id);
      const newRefreshToken = generateMockToken(`refresh-${user.id}`);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        },
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 86400,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  // Logout user
  async logout(): Promise<void> {
    await mockDelay();

    // In a real application:
    // await httpClient.post('/auth/logout');

    // Clear local storage
    storage.clearAuth();
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get<User>('/auth/me'));

    // Mock user retrieval
    const token = storage.getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const userId = decoded.sub;
      
      const user = MOCK_USERS.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  // Validate token
  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },

  // Check if user has specific role
  hasRole: (user: User | null, role: string): boolean => {
    return user?.role === role;
  },

  // Check if user has any of the specified roles
  hasAnyRole: (user: User | null, roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  },
};