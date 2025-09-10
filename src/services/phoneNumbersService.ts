import type { PhoneNumber, CreatePhoneNumberRequest, UpdatePhoneNumberRequest, PaginatedResponse, ApiResponse } from '../types/api';

export const phoneNumbersService = {
  // Get paginated list of phone numbers
  async getPhoneNumbers(page: number = 1, limit: number = 20): Promise<PaginatedResponse<PhoneNumber>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock phone numbers data
    const mockPhoneNumbers: PhoneNumber[] = [
      {
        id: '1',
        number: '+1-555-123-4567',
        countryCode: 'US',
        type: 'local',
        status: 'active',
        assignedAgents: ['1', '5'],
        provider: 'Twilio',
        cost: 1.50,
        capabilities: ['Voice Calls', 'SMS', 'MMS'],
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2 hours ago'
      },
      {
        id: '2',
        number: '+1-800-555-0123',
        countryCode: 'US',
        type: 'toll-free',
        status: 'active',
        assignedAgents: ['2'],
        provider: 'Twilio',
        cost: 2.00,
        capabilities: ['Voice Calls', 'SMS'],
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: '1 day ago'
      },
      {
        id: '3',
        number: '+44-20-7123-4567',
        countryCode: 'GB',
        type: 'local',
        status: 'active',
        assignedAgents: ['3'],
        provider: 'Vonage',
        cost: 1.75,
        capabilities: ['Voice Calls'],
        createdAt: '2024-01-08T14:20:00Z',
        updatedAt: '3 days ago'
      },
      {
        id: '4',
        number: '+1-555-987-6543',
        countryCode: 'US',
        type: 'mobile',
        status: 'inactive',
        assignedAgents: [],
        provider: 'Twilio',
        cost: 1.25,
        capabilities: ['Voice Calls', 'SMS', 'MMS'],
        createdAt: '2024-01-05T09:15:00Z',
        updatedAt: '5 days ago'
      }
    ];

    // Calculate pagination
    const total = mockPhoneNumbers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = mockPhoneNumbers.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },

  // Get single phone number by ID
  async getPhoneNumber(id: string): Promise<ApiResponse<PhoneNumber>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock phone numbers data (same as in getPhoneNumbers)
    const mockPhoneNumbers: PhoneNumber[] = [
      {
        id: '1',
        number: '+1-555-123-4567',
        countryCode: 'US',
        type: 'local',
        status: 'active',
        assignedAgents: ['1', '5'],
        provider: 'Twilio',
        cost: 1.50,
        capabilities: ['Voice Calls', 'SMS', 'MMS'],
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2 hours ago'
      },
      {
        id: '2',
        number: '+1-800-555-0123',
        countryCode: 'US',
        type: 'toll-free',
        status: 'active',
        assignedAgents: ['2'],
        provider: 'Twilio',
        cost: 2.00,
        capabilities: ['Voice Calls', 'SMS'],
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: '1 day ago'
      },
      {
        id: '3',
        number: '+44-20-7123-4567',
        countryCode: 'GB',
        type: 'local',
        status: 'active',
        assignedAgents: ['3'],
        provider: 'Vonage',
        cost: 1.75,
        capabilities: ['Voice Calls'],
        createdAt: '2024-01-08T14:20:00Z',
        updatedAt: '3 days ago'
      },
      {
        id: '4',
        number: '+1-555-987-6543',
        countryCode: 'US',
        type: 'mobile',
        status: 'inactive',
        assignedAgents: [],
        provider: 'Twilio',
        cost: 1.25,
        capabilities: ['Voice Calls', 'SMS', 'MMS'],
        createdAt: '2024-01-05T09:15:00Z',
        updatedAt: '5 days ago'
      }
    ];

    const phoneNumber = mockPhoneNumbers.find(p => p.id === id);
    if (!phoneNumber) {
      throw new Error('Phone number not found');
    }

    return {
      success: true,
      data: phoneNumber,
      message: 'Phone number retrieved successfully'
    };
  },

  // Create a new phone number
  async createPhoneNumber(phoneNumberData: CreatePhoneNumberRequest): Promise<ApiResponse<PhoneNumber>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newPhoneNumber: PhoneNumber = {
      id: Math.random().toString(36).substr(2, 9),
      ...phoneNumberData,
      status: 'pending' as const,
      assignedAgents: [],
      createdAt: new Date().toISOString(),
      updatedAt: 'Just now'
    };

    return {
      success: true,
      data: newPhoneNumber,
      message: 'Phone number created successfully'
    };
  },

  // Update an existing phone number
  async updatePhoneNumber(id: string, updates: UpdatePhoneNumberRequest): Promise<ApiResponse<PhoneNumber>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock updated phone number (in real app, this would come from the API)
    const updatedPhoneNumber: PhoneNumber = {
      id,
      number: updates.number || '+1-555-000-0000',
      countryCode: updates.countryCode || 'US',
      type: updates.type || 'local',
      status: updates.status || 'active',
      assignedAgents: updates.assignedAgents || [],
      provider: updates.provider || 'Twilio',
      cost: updates.cost || 1.50,
      capabilities: updates.capabilities || ['Voice Calls'],
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: 'Just now'
    };

    return {
      success: true,
      data: updatedPhoneNumber,
      message: 'Phone number updated successfully'
    };
  },

  // Delete a phone number
  async deletePhoneNumber(id: string): Promise<ApiResponse<null>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, would delete the phone number with this id
    console.log(`Deleting phone number with id: ${id}`);
    
    return {
      success: true,
      data: null,
      message: 'Phone number deleted successfully'
    };
  },

  // Toggle phone number status
  async togglePhoneNumberStatus(id: string): Promise<ApiResponse<PhoneNumber>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock toggled phone number (in real app, this would come from the API)
    const toggledPhoneNumber: PhoneNumber = {
      id,
      number: '+1-555-000-0000',
      countryCode: 'US',
      type: 'local',
      status: 'active', // This would be toggled based on current status
      assignedAgents: [],
      provider: 'Twilio',
      cost: 1.50,
      capabilities: ['Voice Calls'],
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: 'Just now'
    };

    return {
      success: true,
      data: toggledPhoneNumber,
      message: 'Phone number status updated successfully'
    };
  },

  // Assign agents to phone number
  async assignAgents(phoneNumberId: string, agentIds: string[]): Promise<ApiResponse<PhoneNumber>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock updated phone number with assigned agents
    const updatedPhoneNumber: PhoneNumber = {
      id: phoneNumberId,
      number: '+1-555-000-0000',
      countryCode: 'US',
      type: 'local',
      status: 'active',
      assignedAgents: agentIds,
      provider: 'Twilio',
      cost: 1.50,
      capabilities: ['Voice Calls'],
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: 'Just now'
    };

    return {
      success: true,
      data: updatedPhoneNumber,
      message: 'Agents assigned successfully'
    };
  }
};