import React, { useState } from 'react';
import { useAsync, useAsyncCallback } from '../hooks/useApi';
import { phoneNumbersService } from '../services/phoneNumbersService';
import type { PhoneNumber, CreatePhoneNumberRequest } from '../types/api';

// Modal component for creating/editing phone numbers
const PhoneNumberModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: CreatePhoneNumberRequest) => Promise<void>;
  phoneNumber?: PhoneNumber | null;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, phoneNumber, loading }) => {
  const [formData, setFormData] = useState<CreatePhoneNumberRequest>({
    number: phoneNumber?.number || '',
    countryCode: phoneNumber?.countryCode || 'US',
    type: phoneNumber?.type || 'local',
    provider: phoneNumber?.provider || 'Twilio',
    cost: phoneNumber?.cost || 1.50,
    capabilities: phoneNumber?.capabilities || [],
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
          {phoneNumber ? 'Edit Phone Number' : 'Add New Phone Number'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Phone Number
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              placeholder="+1-555-123-4567"
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
              Country Code
            </label>
            <select
              value={formData.countryCode}
              onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              required
            >
              <option value="US">United States (+1)</option>
              <option value="GB">United Kingdom (+44)</option>
              <option value="CA">Canada (+1)</option>
              <option value="AU">Australia (+61)</option>
              <option value="DE">Germany (+49)</option>
              <option value="FR">France (+33)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'local' | 'toll-free' | 'mobile' }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              required
            >
              <option value="local">Local</option>
              <option value="toll-free">Toll-Free</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Provider
            </label>
            <select
              value={formData.provider}
              onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              required
            >
              <option value="Twilio">Twilio</option>
              <option value="Vonage">Vonage</option>
              <option value="Bandwidth">Bandwidth</option>
              <option value="Plivo">Plivo</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Monthly Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
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
                placeholder="Voice Calls, SMS, MMS"
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
              {loading ? 'Saving...' : phoneNumber ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const PhoneNumbers: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPhoneNumber, setEditingPhoneNumber] = useState<PhoneNumber | null>(null);

  // Fetch phone numbers data
  const { data: phoneNumbersResponse, loading, error, refetch } = useAsync(
    () => phoneNumbersService.getPhoneNumbers(1, 20),
    []
  );

  // Create phone number callback
  const [createPhoneNumber, { loading: createLoading }] = useAsyncCallback(
    async (phoneNumberData: CreatePhoneNumberRequest) => {
      await phoneNumbersService.createPhoneNumber(phoneNumberData);
      await refetch();
    }
  );

  // Update phone number callback
  const [updatePhoneNumber, { loading: updateLoading }] = useAsyncCallback(
    async (id: string, updates: any) => {
      await phoneNumbersService.updatePhoneNumber(id, updates);
      await refetch();
    }
  );

  // Delete phone number callback
  const [deletePhoneNumber, { loading: deleteLoading }] = useAsyncCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this phone number?')) {
        await phoneNumbersService.deletePhoneNumber(id);
        await refetch();
      }
    }
  );

  // Toggle phone number status callback
  const [toggleStatus, { loading: toggleLoading }] = useAsyncCallback(
    async (id: string) => {
      await phoneNumbersService.togglePhoneNumberStatus(id);
      await refetch();
    }
  );

  const phoneNumbers = phoneNumbersResponse?.data || [];

  const getStatusColor = (status: PhoneNumber['status']) => {
    switch (status) {
      case 'active':
        return '#28a745';
      case 'inactive':
        return '#6c757d';
      case 'pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status: PhoneNumber['status']) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'inactive':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getTypeIcon = (type: PhoneNumber['type']) => {
    switch (type) {
      case 'local':
        return '🏠';
      case 'toll-free':
        return '🆓';
      case 'mobile':
        return '📱';
      default:
        return '📞';
    }
  };

  const handleCreatePhoneNumber = async (phoneNumberData: CreatePhoneNumberRequest) => {
    await createPhoneNumber(phoneNumberData);
  };

  const handleEditPhoneNumber = (phoneNumber: PhoneNumber) => {
    setEditingPhoneNumber(phoneNumber);
    setShowModal(true);
  };

  const handleUpdatePhoneNumber = async (phoneNumberData: CreatePhoneNumberRequest) => {
    if (editingPhoneNumber) {
      await updatePhoneNumber(editingPhoneNumber.id, phoneNumberData);
      setEditingPhoneNumber(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPhoneNumber(null);
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
            Phone Numbers
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
          Phone Numbers
        </h1>
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #f5c6cb',
          textAlign: 'center',
        }}>
          Error loading phone numbers: {error}
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
            Phone Numbers
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
            Add New Number
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
            Manage your phone numbers and assign them to voice agents. Monitor costs and capabilities for each number.
          </p>
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#e7f3ff', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            📞 <strong>Voice Integration:</strong> All phone numbers can be assigned to voice agents for call handling and automated conversations.
          </div>
        </div>

        {/* Phone Numbers Grid */}
        <div style={{ 
          display: 'grid', 
          gap: '1.5rem', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' 
        }}>
          {phoneNumbers.map((phoneNumber) => {
            const isActionLoading = toggleLoading || deleteLoading;
            return (
              <div
                key={phoneNumber.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{getTypeIcon(phoneNumber.type)}</span>
                    <h3 style={{ 
                      margin: 0, 
                      color: '#333',
                      fontSize: '1.3rem',
                      fontWeight: 'bold'
                    }}>
                      {phoneNumber.number}
                    </h3>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    backgroundColor: getStatusColor(phoneNumber.status),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    <span>{getStatusIcon(phoneNumber.status)}</span>
                    {phoneNumber.status.charAt(0).toUpperCase() + phoneNumber.status.slice(1)}
                  </div>
                </div>

                {/* Phone Number Details */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem',
                  marginBottom: '1rem',
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
                      Type
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {phoneNumber.type.charAt(0).toUpperCase() + phoneNumber.type.slice(1)}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Country
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {phoneNumber.countryCode}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Provider
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      {phoneNumber.provider}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      color: '#888', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold' 
                    }}>
                      Monthly Cost
                    </label>
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      color: '#333',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      ${phoneNumber.cost.toFixed(2)}
                    </p>
                  </div>
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
                    {phoneNumber.capabilities.map((capability) => (
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

                {/* Assigned Agents */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    color: '#888', 
                    fontSize: '0.9rem', 
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>
                    Assigned Agents
                  </label>
                  <p style={{ 
                    margin: 0, 
                    color: '#333',
                    fontSize: '0.9rem'
                  }}>
                    {phoneNumber.assignedAgents.length > 0 
                      ? `${phoneNumber.assignedAgents.length} agent(s) assigned`
                      : 'No agents assigned'
                    }
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => handleEditPhoneNumber(phoneNumber)}
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
                    onClick={() => toggleStatus(phoneNumber.id)}
                    disabled={isActionLoading}
                    style={{
                      backgroundColor: phoneNumber.status === 'active' ? '#dc3545' : '#28a745',
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
                    {phoneNumber.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deletePhoneNumber(phoneNumber.id)}
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
            Phone Number Summary
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                {phoneNumbers.length}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Numbers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {phoneNumbers.filter(p => p.status === 'active').length}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Active</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6c757d' }}>
                {phoneNumbers.filter(p => p.status === 'inactive').length}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Inactive</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                ${phoneNumbers.reduce((sum, p) => sum + p.cost, 0).toFixed(2)}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Monthly Cost</div>
            </div>
          </div>
        </div>

        {/* Phone Number Modal */}
        <PhoneNumberModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={editingPhoneNumber ? handleUpdatePhoneNumber : handleCreatePhoneNumber}
          phoneNumber={editingPhoneNumber}
          loading={createLoading || updateLoading}
        />
      </div>
    </>
  );
};