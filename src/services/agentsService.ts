// Agents API service

import type { Agent, CreateAgentRequest, UpdateAgentRequest, PaginatedResponse } from '../types/api';

// Mock API delay
const MOCK_DELAY = 800;

// Mock agents database
let MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'GPT Assistant',
    status: 'active',
    type: 'Language Model',
    lastUpdated: '2 hours ago',
    description: 'General purpose AI assistant for text generation and analysis',
    capabilities: ['Text Generation', 'Q&A', 'Summarization', 'Translation'],
    metrics: {
      requestsToday: 1250,
      averageResponseTime: 340,
      successRate: 98.5,
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Code Reviewer',
    status: 'active',
    type: 'Code Analysis',
    lastUpdated: '30 minutes ago',
    description: 'Specialized agent for code review and quality assurance',
    capabilities: ['Code Review', 'Bug Detection', 'Style Analysis', 'Security Scan'],
    metrics: {
      requestsToday: 450,
      averageResponseTime: 1200,
      successRate: 99.2,
    },
    createdAt: '2024-01-05T14:30:00Z',
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Data Processor',
    status: 'maintenance',
    type: 'Data Analysis',
    lastUpdated: '1 day ago',
    description: 'Processes and analyzes large datasets for insights',
    capabilities: ['Data Mining', 'Statistical Analysis', 'Visualization', 'ML Training'],
    metrics: {
      requestsToday: 0,
      averageResponseTime: 2800,
      successRate: 96.8,
    },
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'Image Generator',
    status: 'inactive',
    type: 'Image Creation',
    lastUpdated: '3 days ago',
    description: 'Creates and modifies images based on text prompts',
    capabilities: ['Image Generation', 'Style Transfer', 'Image Editing', 'Upscaling'],
    metrics: {
      requestsToday: 0,
      averageResponseTime: 4500,
      successRate: 94.1,
    },
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    name: 'Task Scheduler',
    status: 'active',
    type: 'Automation',
    lastUpdated: '1 hour ago',
    description: 'Manages and schedules automated tasks and workflows',
    capabilities: ['Task Scheduling', 'Workflow Management', 'Automation', 'Monitoring'],
    metrics: {
      requestsToday: 820,
      averageResponseTime: 150,
      successRate: 99.7,
    },
    createdAt: '2024-01-15T11:20:00Z',
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

// Mock delay function
const mockDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

// Helper function to format last updated time
const formatLastUpdated = (updatedAt: string): string => {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffMs = now.getTime() - updated.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
};

export const agentsService = {
  // Get all agents with pagination
  async getAgents(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Agent>> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get<PaginatedResponse<Agent>>(`/agents?page=${page}&limit=${limit}`));

    // Mock pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAgents = MOCK_AGENTS.slice(startIndex, endIndex);

    // Update lastUpdated times
    const agentsWithUpdatedTimes = paginatedAgents.map(agent => ({
      ...agent,
      lastUpdated: formatLastUpdated(agent.updatedAt),
    }));

    return {
      success: true,
      data: agentsWithUpdatedTimes,
      pagination: {
        page,
        limit,
        total: MOCK_AGENTS.length,
        totalPages: Math.ceil(MOCK_AGENTS.length / limit),
      },
    };
  },

  // Get single agent by ID
  async getAgent(id: string): Promise<Agent> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get<Agent>(`/agents/${id}`));

    const agent = MOCK_AGENTS.find(a => a.id === id);
    if (!agent) {
      throw new Error('Agent not found');
    }

    return {
      ...agent,
      lastUpdated: formatLastUpdated(agent.updatedAt),
    };
  },

  // Create new agent
  async createAgent(agentData: CreateAgentRequest): Promise<Agent> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.post<Agent>('/agents', agentData));

    const newAgent: Agent = {
      id: (MOCK_AGENTS.length + 1).toString(),
      ...agentData,
      status: 'inactive',
      lastUpdated: 'Just now',
      metrics: {
        requestsToday: 0,
        averageResponseTime: 0,
        successRate: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_AGENTS.push(newAgent);
    return newAgent;
  },

  // Update existing agent
  async updateAgent(id: string, updates: UpdateAgentRequest): Promise<Agent> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.put<Agent>(`/agents/${id}`, updates));

    const agentIndex = MOCK_AGENTS.findIndex(a => a.id === id);
    if (agentIndex === -1) {
      throw new Error('Agent not found');
    }

    const updatedAgent: Agent = {
      ...MOCK_AGENTS[agentIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      lastUpdated: 'Just now',
    };

    MOCK_AGENTS[agentIndex] = updatedAgent;
    return updatedAgent;
  },

  // Delete agent
  async deleteAgent(id: string): Promise<void> {
    await mockDelay();

    // In a real application:
    // await httpClient.delete(`/agents/${id}`);

    const agentIndex = MOCK_AGENTS.findIndex(a => a.id === id);
    if (agentIndex === -1) {
      throw new Error('Agent not found');
    }

    MOCK_AGENTS.splice(agentIndex, 1);
  },

  // Start/Stop agent
  async toggleAgentStatus(id: string): Promise<Agent> {
    await mockDelay();

    const agent = MOCK_AGENTS.find(a => a.id === id);
    if (!agent) {
      throw new Error('Agent not found');
    }

    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    return this.updateAgent(id, { status: newStatus });
  },

  // Get agent statistics
  async getAgentStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
    totalRequestsToday: number;
    averageResponseTime: number;
    overallSuccessRate: number;
  }> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get('/agents/stats'));

    const total = MOCK_AGENTS.length;
    const active = MOCK_AGENTS.filter(a => a.status === 'active').length;
    const inactive = MOCK_AGENTS.filter(a => a.status === 'inactive').length;
    const maintenance = MOCK_AGENTS.filter(a => a.status === 'maintenance').length;

    const totalRequestsToday = MOCK_AGENTS.reduce((sum, agent) => sum + agent.metrics.requestsToday, 0);
    const averageResponseTime = MOCK_AGENTS.reduce((sum, agent) => sum + agent.metrics.averageResponseTime, 0) / total;
    const overallSuccessRate = MOCK_AGENTS.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / total;

    return {
      total,
      active,
      inactive,
      maintenance,
      totalRequestsToday,
      averageResponseTime: Math.round(averageResponseTime),
      overallSuccessRate: Math.round(overallSuccessRate * 100) / 100,
    };
  },

  // Bulk update agents
  async bulkUpdateAgents(agentIds: string[], updates: UpdateAgentRequest): Promise<Agent[]> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.patch('/agents/bulk', { ids: agentIds, updates }));

    const updatedAgents: Agent[] = [];
    
    for (const id of agentIds) {
      try {
        const updatedAgent = await this.updateAgent(id, updates);
        updatedAgents.push(updatedAgent);
      } catch (error) {
        console.warn(`Failed to update agent ${id}:`, error);
      }
    }

    return updatedAgents;
  },
};