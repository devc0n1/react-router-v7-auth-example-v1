import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAsync } from '../hooks/useApi';
import { phoneNumbersService } from '../services/phoneNumbersService';
import { agentsService } from '../services/agentsService';
import type { Agent } from '../types/api';

export const PhoneNumberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: phoneNumberResponse, loading, error } = useAsync(
    () => phoneNumbersService.getPhoneNumber(id!),
    [id]
  );

  // Get all agents to match assigned agent IDs
  const { data: agentsResponse } = useAsync(
    () => agentsService.getAgents(1, 50),
    []
  );

  const phoneNumber = phoneNumberResponse?.data;
  const allAgents = agentsResponse?.data || [];
  
  // Get assigned agents details
  const assignedAgents = phoneNumber?.assignedAgents
    .map(agentId => allAgents.find(agent => agent.id === agentId))
    .filter(Boolean) as Agent[];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading phone number details...</p>
        </div>
      </div>
    );
  }

  if (error || !phoneNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Phone Number Not Found</h2>
          <p className="text-gray-600 mb-6">The phone number you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/phone-numbers"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Phone Numbers
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'inactive': return '⭕';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'local': return '🏠';
      case 'toll-free': return '🆓';
      case 'mobile': return '📱';
      default: return '📞';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'twilio': return '💜';
      case 'vonage': return '🔷';
      case 'bandwidth': return '🔵';
      case 'plivo': return '🟢';
      default: return '📡';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/phone-numbers')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Phone Numbers
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  {getTypeIcon(phoneNumber.type)} {phoneNumber.number}
                </h1>
                <p className="text-gray-600 mt-1">
                  {phoneNumber.type.charAt(0).toUpperCase() + phoneNumber.type.slice(1)} number from {phoneNumber.countryCode}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(phoneNumber.status)}`}>
                {getStatusIcon(phoneNumber.status)} {phoneNumber.status.charAt(0).toUpperCase() + phoneNumber.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Usage Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                📊 Usage Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-600 mt-1">Total Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">89</div>
                  <div className="text-sm text-gray-600 mt-1">Calls Today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">5.2 min</div>
                  <div className="text-sm text-gray-600 mt-1">Avg Duration</div>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🛠️ Capabilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {phoneNumber.capabilities.map((capability, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {capability === 'Voice Calls' && '📞'} 
                    {capability === 'SMS' && '💬'} 
                    {capability === 'MMS' && '📷'} 
                    {capability}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Voice Agents */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🎤 Assigned Voice Agents
              </h2>
              {assignedAgents.length > 0 ? (
                <div className="space-y-3">
                  {assignedAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🤖</span>
                        <div>
                          <p className="font-medium text-gray-900">{agent.name}</p>
                          <p className="text-sm text-gray-600">{agent.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                          {agent.status}
                        </span>
                        <Link
                          to={`/agents/${agent.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🚫</div>
                  <p>No voice agents assigned</p>
                  <Link
                    to="/agents"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                  >
                    Assign Voice Agents →
                  </Link>
                </div>
              )}
            </div>

            {/* Call Routing Configuration */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🔀 Call Routing Configuration
              </h2>
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Round Robin</span>
                  <span className="text-sm text-blue-600">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Failover</span>
                  <span className="text-sm text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Business Hours Only</span>
                  <span className="text-sm text-gray-600">9 AM - 5 PM EST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ℹ️ Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number ID</label>
                  <p className="text-gray-900 font-mono">{phoneNumber.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Number</label>
                  <p className="text-gray-900 font-mono text-lg">{phoneNumber.number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="text-gray-900">{phoneNumber.type.charAt(0).toUpperCase() + phoneNumber.type.slice(1)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Country</label>
                  <p className="text-gray-900">{phoneNumber.countryCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900">{phoneNumber.updatedAt}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900">{new Date(phoneNumber.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {getProviderIcon(phoneNumber.provider)} Provider Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Provider</label>
                  <p className="text-gray-900">{phoneNumber.provider}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Monthly Cost</label>
                  <p className="text-gray-900 text-lg font-semibold text-green-600">${phoneNumber.cost.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Billing Cycle</label>
                  <p className="text-gray-900">Monthly</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Next Billing Date</label>
                  <p className="text-gray-900">January 15, 2025</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ⚡ Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Edit Number
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  {phoneNumber.status === 'active' ? 'Deactivate' : 'Activate'} Number
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Assign Agents
                </button>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors">
                  View Call Logs
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Release Number
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};