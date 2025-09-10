import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAsync } from '../hooks/useApi';
import { agentsService } from '../services/agentsService';

export const VoiceAgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: agent, loading, error } = useAsync(
    () => agentsService.getAgent(id!),
    [id]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading voice agent details...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Voice Agent Not Found</h2>
          <p className="text-gray-600 mb-6">The voice agent you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/agents"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Voice Agents
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'inactive': return '⭕';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'customer support': return '🎧';
      case 'sales agent': return '💼';
      case 'appointment scheduler': return '📅';
      case 'survey collector': return '📊';
      case 'order taker': return '🛒';
      default: return '🤖';
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
                onClick={() => navigate('/agents')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Voice Agents
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  {getTypeIcon(agent.type)} {agent.name}
                </h1>
                <p className="text-gray-600 mt-1">{agent.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agent.status)}`}>
                {getStatusIcon(agent.status)} {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
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
            
            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                📊 Performance Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{agent.metrics.callsToday}</div>
                  <div className="text-sm text-gray-600 mt-1">Calls Today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{agent.metrics.averageCallDuration} min</div>
                  <div className="text-sm text-gray-600 mt-1">Avg Call Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{agent.metrics.successRate}%</div>
                  <div className="text-sm text-gray-600 mt-1">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🛠️ Capabilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((capability, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Phone Numbers */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📱 Assigned Phone Numbers
              </h2>
              {agent.phoneNumbers.length > 0 ? (
                <div className="space-y-3">
                  {agent.phoneNumbers.map((phoneNumber, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📞</span>
                        <span className="font-mono text-lg">{phoneNumber}</span>
                      </div>
                      <Link
                        to={`/phone-numbers/1`} // Note: In a real app, you'd have the phone number ID
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📵</div>
                  <p>No phone numbers assigned</p>
                  <Link
                    to="/phone-numbers"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                  >
                    Assign Phone Numbers →
                  </Link>
                </div>
              )}
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
                  <label className="text-sm font-medium text-gray-600">Agent ID</label>
                  <p className="text-gray-900 font-mono">{agent.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="text-gray-900">{agent.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900">{agent.lastUpdated}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900">{new Date(agent.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Voice Configuration */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🎤 Voice Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Voice Model</label>
                  <p className="text-gray-900">{agent.voiceModel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Language</label>
                  <p className="text-gray-900">{agent.language}</p>
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
                  Edit Agent
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  {agent.status === 'active' ? 'Deactivate' : 'Activate'} Agent
                </button>
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors">
                  View Call History
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Delete Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};