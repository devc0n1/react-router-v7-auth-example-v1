import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsync, useAsyncCallback } from '../hooks/useApi';
import { agentsService } from '../services/agentsService';
import type { Agent, CreateAgentRequest } from '../types/api';

// Modal component for creating/editing agents
const AgentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agent: CreateAgentRequest) => Promise<void>;
  agent?: Agent | null;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, agent, loading }) => {
  const [formData, setFormData] = useState<CreateAgentRequest>({
    name: agent?.name || '',
    type: agent?.type || '',
    description: agent?.description || '',
    capabilities: agent?.capabilities || [],
  });
  const [capabilityInput, setCapabilityInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const addCapability = () => {
    if (capabilityInput.trim() && !formData.capabilities.includes(capabilityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, capabilityInput.trim()]
      }));
      setCapabilityInput('');
    }
  };

  const removeCapability = (capability: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter(c => c !== capability)
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
          {agent ? 'Edit Voice Agent' : 'Create New Voice Agent'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              required
            >
              <option value="">Select a type</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Sales Agent">Sales Agent</option>
              <option value="Appointment Scheduler">Appointment Scheduler</option>
              <option value="Survey Collector">Survey Collector</option>
              <option value="Order Taker">Order Taker</option>
              <option value="Lead Qualifier">Lead Qualifier</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '80px',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Capabilities
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={capabilityInput}
                onChange={(e) => setCapabilityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
                placeholder="Add capability"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
              <button
                type="button"
                onClick={addCapability}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.capabilities.map((capability) => (
                <span
                  key={capability}
                  style={{
                    backgroundColor: '#e9ecef',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {capability}
                  <button
                    type="button"
                    onClick={() => removeCapability(capability)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '0.8rem',
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {loading && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></div>
              )}
              {loading ? 'Saving...' : agent ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Agents: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Fetch agents data
  const { data: agentsResponse, loading, error, refetch } = useAsync(
    () => agentsService.getAgents(1, 20),
    []
  );

  // Create agent callback
  const [createAgent, { loading: createLoading }] = useAsyncCallback(
    async (agentData: CreateAgentRequest) => {
      await agentsService.createAgent(agentData);
      await refetch();
    }
  );

  // Update agent callback
  const [updateAgent, { loading: updateLoading }] = useAsyncCallback(
    async (id: string, updates: any) => {
      await agentsService.updateAgent(id, updates);
      await refetch();
    }
  );

  // Delete agent callback
  const [deleteAgent, { loading: deleteLoading }] = useAsyncCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this agent?')) {
        await agentsService.deleteAgent(id);
        await refetch();
      }
    }
  );

  // Toggle agent status callback
  const [toggleStatus, { loading: toggleLoading }] = useAsyncCallback(
    async (id: string) => {
      await agentsService.toggleAgentStatus(id);
      await refetch();
    }
  );

  const agents = agentsResponse?.data || [];

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return '#28a745';
      case 'inactive':
        return '#6c757d';
      case 'maintenance':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'inactive':
        return '❌';
      case 'maintenance':
        return '🔧';
      default:
        return '❓';
    }
  };

  const handleCreateAgent = async (agentData: CreateAgentRequest) => {
    await createAgent(agentData);
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowModal(true);
  };

  const handleUpdateAgent = async (agentData: CreateAgentRequest) => {
    if (editingAgent) {
      await updateAgent(editingAgent.id, agentData);
      setEditingAgent(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAgent(null);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
    </div>
  );

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div>
          <h1 style={{ 
            color: '#333', 
            margin: '0 0 2rem 0',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            Voice Agents
          </h1>
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ 
          color: '#333', 
          margin: '0 0 2rem 0',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          Voice Agents
        </h1>
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #f5c6cb',
          textAlign: 'center',
        }}>
          Error loading agents: {error}
          <br />
          <button
            onClick={refetch}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <h1 style={{ 
            color: '#333', 
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            Voice Agents
          </h1>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            Add New Voice Agent
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
            Monitor and manage your voice agents with full CRUD operations. Each agent handles voice calls and conversations.
          </p>
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#e7f3ff', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            💡 <strong>Voice Integration:</strong> All operations (Create, Read, Update, Delete) are handled through HTTP API calls with proper loading states and error handling.
          </div>
        </div>

        {/* Agents Grid */}
        <div style={{ 
          display: 'grid', 
          gap: '1.5rem', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' 
        }}>
          {agents.map((agent) => {
            const isActionLoading = toggleLoading || deleteLoading;
            return (
              <div
                key={agent.id}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  opacity: isActionLoading ? 0.7 : 1,
                }}
                onMouseOver={(e) => {
                  if (!isActionLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActionLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: '#333',
                    fontSize: '1.3rem',
                    fontWeight: 'bold'
                  }}>
                    {agent.name}
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    backgroundColor: getStatusColor(agent.status),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    <span>{getStatusIcon(agent.status)}</span>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ 
                    color: '#666', 
                    margin: '0 0 0.5rem 0',
                    lineHeight: '1.5'
                  }}>
                    {agent.description}
                  </p>
                </div>

                {/* Capabilities */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    color: '#888', 
                    fontSize: '0.9rem', 
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>
                    Capabilities
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {agent.capabilities.map((capability) => (
                      <span
                        key={capability}
                        style={{
                          backgroundColor: '#e9ecef',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          color: '#333',
                        }}
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Calls Today
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {agent.metrics.callsToday.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Success Rate
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {agent.metrics.successRate}%
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Type
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {agent.type}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Last Updated
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {agent.lastUpdated}
                    </p>
                  </div>
                </div>

                {/* Voice Configuration */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem',
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#fff3cd',
                  borderRadius: '4px',
                  border: '1px solid #ffeaa7'
                }}>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Voice Model
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {agent.voiceModel}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Language
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {agent.language}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Phone Numbers
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {agent.phoneNumbers.length > 0 ? `${agent.phoneNumbers.length} assigned` : 'None assigned'}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Avg Call Duration
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {agent.metrics.averageCallDuration.toFixed(1)} min
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap'
                }}>
                  <Link
                    to={`/agents/${agent.id}`}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#17a2b8',
                      border: '1px solid #17a2b8',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#17a2b8';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#17a2b8';
                    }}
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleEditAgent(agent)}
                    disabled={isActionLoading}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#007bff',
                      border: '1px solid #007bff',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: isActionLoading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      opacity: isActionLoading ? 0.5 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!isActionLoading) {
                        e.currentTarget.style.backgroundColor = '#007bff';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActionLoading) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#007bff';
                      }
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(agent.id)}
                    disabled={isActionLoading}
                    style={{
                      backgroundColor: agent.status === 'active' ? '#dc3545' : '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: isActionLoading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      opacity: isActionLoading ? 0.5 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!isActionLoading) {
                        e.currentTarget.style.opacity = '0.8';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActionLoading) {
                        e.currentTarget.style.opacity = '1';
                      }
                    }}
                  >
                    {agent.status === 'active' ? 'Stop' : 'Start'}
                  </button>
                  <button
                    onClick={() => deleteAgent(agent.id)}
                    disabled={isActionLoading}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: isActionLoading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      opacity: isActionLoading ? 0.5 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!isActionLoading) {
                        e.currentTarget.style.opacity = '0.8';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActionLoading) {
                        e.currentTarget.style.opacity = '1';
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ 
            color: '#333', 
            margin: '0 0 1rem 0',
            fontSize: '1.25rem'
          }}>
            Agent Summary
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                {agents.length}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Agents</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {agents.filter(a => a.status === 'active').length}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Active</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6c757d' }}>
                {agents.filter(a => a.status === 'inactive').length}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Inactive</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                {agents.filter(a => a.status === 'maintenance').length}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Maintenance</div>
            </div>
          </div>
        </div>

        {/* Agent Modal */}
        <AgentModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={editingAgent ? handleUpdateAgent : handleCreateAgent}
          agent={editingAgent}
          loading={createLoading || updateLoading}
        />
      </div>
    </>
  );
};