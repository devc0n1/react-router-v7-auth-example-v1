// Agents API service

import type { Agent, CreateAgentRequest, UpdateAgentRequest, PaginatedResponse } from '../types/api';

// Mock API delay
const MOCK_DELAY = 800;

// Mock agents database
let MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Customer Support Agent',
    status: 'active',
    type: 'Customer Support',
    lastUpdated: '2 hours ago',
    description: 'Handles customer inquiries, support tickets, and troubleshooting via voice calls',
    capabilities: ['Customer Support', 'Issue Resolution', 'Product Knowledge', 'Escalation Management'],
    phoneNumbers: ['+1-555-123-4567', '+1-800-555-0123'],
    voiceModel: 'Female Professional',
    language: 'English (US)',
    metrics: {
      callsToday: 125,
      averageCallDuration: 4.2,
      successRate: 94.8,
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Sales Specialist',
    status: 'active',
    type: 'Sales Agent',
    lastUpdated: '30 minutes ago',
    description: 'Engages prospects, qualifies leads, and closes sales through persuasive voice conversations',
    capabilities: ['Lead Qualification', 'Product Demos', 'Objection Handling', 'Closing Techniques'],
    phoneNumbers: ['+1-555-987-6543'],
    voiceModel: 'Male Confident',
    language: 'English (US)',
    metrics: {
      callsToday: 78,
      averageCallDuration: 8.7,
      successRate: 87.3,
    },
    createdAt: '2024-01-05T14:30:00Z',
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Appointment Scheduler',
    status: 'maintenance',
    type: 'Appointment Scheduler',
    lastUpdated: '1 day ago',
    description: 'Books appointments, manages calendars, and handles scheduling conflicts via phone',
    capabilities: ['Calendar Management', 'Time Slot Booking', 'Reminder Systems', 'Rescheduling'],
    phoneNumbers: ['+44-20-7123-4567'],
    voiceModel: 'Female Friendly',
    language: 'English (UK)',
    metrics: {
      callsToday: 0,
      averageCallDuration: 3.1,
      successRate: 96.8,
    },
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'Survey Collector',
    status: 'inactive',
    type: 'Survey Collector',
    lastUpdated: '3 days ago',
    description: 'Conducts phone surveys, collects customer feedback, and gathers market research data',
    capabilities: ['Survey Administration', 'Data Collection', 'Response Recording', 'Follow-up Calls'],
    phoneNumbers: [],
    voiceModel: 'Neutral Professional',
    language: 'English (US)',
    metrics: {
      callsToday: 0,
      averageCallDuration: 5.4,
      successRate: 89.1,
    },
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    name: 'Order Processing Agent',
    status: 'active',
    type: 'Order Taker',
    lastUpdated: '1 hour ago',
    description: 'Takes phone orders, processes payments, and handles order modifications and tracking',
    capabilities: ['Order Taking', 'Payment Processing', 'Inventory Checks', 'Order Tracking'],
    phoneNumbers: ['+1-555-123-4567'],
    voiceModel: 'Female Efficient',
    language: 'English (US)',
    metrics: {
      callsToday: 203,
      averageCallDuration: 6.8,
      successRate: 98.2,
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
        callsToday: 0,
        averageCallDuration: 0,
        successRate: 0,
      },
      phoneNumbers: [],
      voiceModel: agentData.voiceModel || 'Female Professional',
      language: agentData.language || 'English (US)',
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
    totalCallsToday: number;
    averageCallDuration: number;
    overallSuccessRate: number;
  }> {
    await mockDelay();

    // In a real application:
    // return apiUtils.handleResponse(await httpClient.get('/agents/stats'));

    const total = MOCK_AGENTS.length;
    const active = MOCK_AGENTS.filter(a => a.status === 'active').length;
    const inactive = MOCK_AGENTS.filter(a => a.status === 'inactive').length;
    const maintenance = MOCK_AGENTS.filter(a => a.status === 'maintenance').length;

    const totalCallsToday = MOCK_AGENTS.reduce((sum, agent) => sum + agent.metrics.callsToday, 0);
    const averageCallDuration = MOCK_AGENTS.reduce((sum, agent) => sum + agent.metrics.averageCallDuration, 0) / total;
    const overallSuccessRate = MOCK_AGENTS.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / total;

    return {
      total,
      active,
      inactive,
      maintenance,
      totalCallsToday,
      averageCallDuration: Math.round(averageCallDuration * 10) / 10,
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