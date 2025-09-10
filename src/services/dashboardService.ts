// Dashboard API service

import type { DashboardStats, RecentActivity } from '../types/api';

// Mock API delay
const MOCK_DELAY = 600;

// Mock delay function
const mockDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

// Mock recent activities
const MOCK_ACTIVITIES: RecentActivity[] = [
  {
    id: '1',
    type: 'login',
    message: 'Successfully logged in',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    icon: '✅',
  },
  {
    id: '2',
    type: 'agent_created',
    message: 'Created new agent: Task Scheduler',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: '🏠',
  },
  {
    id: '3',
    type: 'system_event',
    message: 'Session initialized',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    icon: '💻',
  },
  {
    id: '4',
    type: 'agent_updated',
    message: 'Updated GPT Assistant configuration',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    icon: '⚙️',
  },
  {
    id: '5',
    type: 'system_event',
    message: 'System backup completed',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    icon: '💾',
  },
];

// Helper to format uptime
const formatUptime = (): string => {
  const startTime = new Date('2024-01-01T00:00:00Z');
  const now = new Date();
  const diffMs = now.getTime() - startTime.getTime();
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}d ${hours}h ${minutes}m`;
};

export const dashboardService = {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get<DashboardStats>('/dashboard/stats'));

    // Mock dashboard stats
    const stats: DashboardStats = {
      totalAgents: 5,
      activeAgents: 3,
      totalRequests: 2520,
      averageResponseTime: 890,
      systemUptime: formatUptime(),
      lastUpdated: new Date().toISOString(),
    };

    return stats;
  },

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get<RecentActivity[]>(`/dashboard/activity?limit=${limit}`));

    // Return recent activities with relative timestamps
    return MOCK_ACTIVITIES.slice(0, limit).map(activity => ({
      ...activity,
      timestamp: this.formatRelativeTime(activity.timestamp),
    }));
  },

  // Get system health
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    checks: {
      database: boolean;
      api: boolean;
      storage: boolean;
      agents: boolean;
    };
    lastCheck: string;
  }> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get('/dashboard/health'));

    // Mock system health
    const checks = {
      database: true,
      api: true,
      storage: true,
      agents: true,
    };

    const allHealthy = Object.values(checks).every(Boolean);
    const status = allHealthy ? 'healthy' : 'warning';

    return {
      status,
      checks,
      lastCheck: new Date().toISOString(),
    };
  },

  // Get performance metrics
  async getPerformanceMetrics(): Promise<{
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    activeConnections: number;
  }> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get('/dashboard/performance'));

    // Mock performance metrics with some randomness
    return {
      cpuUsage: Math.floor(Math.random() * 30) + 15, // 15-45%
      memoryUsage: Math.floor(Math.random() * 40) + 30, // 30-70%
      diskUsage: Math.floor(Math.random() * 20) + 40, // 40-60%
      networkLatency: Math.floor(Math.random() * 50) + 10, // 10-60ms
      activeConnections: Math.floor(Math.random() * 100) + 50, // 50-150
    };
  },

  // Helper method to format relative time
  formatRelativeTime: (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  },

  // Get user activity summary
  async getUserActivitySummary(_userId: string): Promise<{
    loginCount: number;
    lastLogin: string;
    agentsCreated: number;
    agentsModified: number;
    totalSessions: number;
  }> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get(`/dashboard/user-activity/${userId}`));

    // Mock user activity data
    return {
      loginCount: 12,
      lastLogin: new Date().toISOString(),
      agentsCreated: 3,
      agentsModified: 8,
      totalSessions: 25,
    };
  },
};