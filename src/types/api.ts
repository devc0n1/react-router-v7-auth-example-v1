// API Types and Interfaces

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Agent Types
export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  type: string;
  lastUpdated: string;
  description: string;
  capabilities: string[];
  metrics: {
    requestsToday: number;
    averageResponseTime: number;
    successRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentRequest {
  name: string;
  type: string;
  description: string;
  capabilities: string[];
}

export interface UpdateAgentRequest {
  name?: string;
  type?: string;
  description?: string;
  capabilities?: string[];
  status?: 'active' | 'inactive' | 'maintenance';
}

// Dashboard Types
export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalRequests: number;
  averageResponseTime: number;
  systemUptime: string;
  lastUpdated: string;
}

export interface RecentActivity {
  id: string;
  type: 'login' | 'agent_created' | 'agent_updated' | 'agent_deleted' | 'system_event';
  message: string;
  timestamp: string;
  icon: string;
}

// API Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// HTTP Request Config
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}