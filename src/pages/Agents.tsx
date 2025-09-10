import React, { useState } from 'react';

interface Agent {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  type: string;
  lastUpdated: string;
  description: string;
}

export const Agents: React.FC = () => {
  const [agents] = useState<Agent[]>([
    {
      id: 1,
      name: 'GPT Assistant',
      status: 'active',
      type: 'Language Model',
      lastUpdated: '2 hours ago',
      description: 'General purpose AI assistant for text generation and analysis'
    },
    {
      id: 2,
      name: 'Code Reviewer',
      status: 'active',
      type: 'Code Analysis',
      lastUpdated: '30 minutes ago',
      description: 'Specialized agent for code review and quality assurance'
    },
    {
      id: 3,
      name: 'Data Processor',
      status: 'maintenance',
      type: 'Data Analysis',
      lastUpdated: '1 day ago',
      description: 'Processes and analyzes large datasets for insights'
    },
    {
      id: 4,
      name: 'Image Generator',
      status: 'inactive',
      type: 'Image Creation',
      lastUpdated: '3 days ago',
      description: 'Creates and modifies images based on text prompts'
    },
    {
      id: 5,
      name: 'Task Scheduler',
      status: 'active',
      type: 'Automation',
      lastUpdated: '1 hour ago',
      description: 'Manages and schedules automated tasks and workflows'
    }
  ]);

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

  return (
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
          AI Agents
        </h1>
        <button style={{
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
          Add New Agent
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
          Monitor and manage your AI agents. Each agent has specific capabilities and current operational status.
        </p>
      </div>

      {/* Agents Grid */}
      <div style={{ 
        display: 'grid', 
        gap: '1.5rem', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' 
      }}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
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

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{ 
                  color: '#888', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold' 
                }}>
                  Type
                </label>
                <p style={{ 
                  margin: '0.25rem 0 0 0', 
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {agent.type}
                </p>
              </div>
              <div>
                <label style={{ 
                  color: '#888', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold' 
                }}>
                  Last Updated
                </label>
                <p style={{ 
                  margin: '0.25rem 0 0 0', 
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {agent.lastUpdated}
                </p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '0.75rem',
              justifyContent: 'flex-end'
            }}>
              <button style={{
                backgroundColor: 'transparent',
                color: '#007bff',
                border: '1px solid #007bff',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#007bff';
              }}
              >
                Configure
              </button>
              <button style={{
                backgroundColor: agent.status === 'active' ? '#dc3545' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              >
                {agent.status === 'active' ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>
        ))}
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
    </div>
  );
};