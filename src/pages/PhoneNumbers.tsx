import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          {phoneNumber ? 'Edit Phone Number' : 'Add New Phone Number'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              placeholder="+1-555-123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Code
            </label>
            <select
              value={formData.countryCode}
              onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'local' | 'toll-free' | 'mobile' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="local">Local</option>
              <option value="toll-free">Toll-Free</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider
            </label>
            <select
              value={formData.provider}
              onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Twilio">Twilio</option>
              <option value="Vonage">Vonage</option>
              <option value="Bandwidth">Bandwidth</option>
              <option value="Plivo">Plivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capabilities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={capabilityInput}
                onChange={(e) => setCapabilityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
                placeholder="Voice Calls, SMS, MMS"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addCapability}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {capability}
                  <button
                    type="button"
                    onClick={() => removeCapability(capability)}
                    className="text-gray-500 hover:text-gray-700 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
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
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="flex items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Phone Numbers
        </h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Phone Numbers
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <p className="text-red-700 mb-4">Error loading phone numbers: {error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Phone Numbers
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        >
          Add New Number
        </button>
      </div>

      <div className="mb-8">
        <p className="text-gray-600 text-lg mb-4">
          Manage your phone numbers and assign them to voice agents. Monitor costs and capabilities for each number.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800 text-sm">
            📞 <strong>Voice Integration:</strong> All phone numbers can be assigned to voice agents for call handling and automated conversations.
          </p>
        </div>
      </div>

      {/* Phone Numbers List View */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Phone Numbers List</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capabilities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {phoneNumbers.map((phoneNumber) => {
                const isActionLoading = toggleLoading || deleteLoading;
                return (
                  <tr key={phoneNumber.id} className={`hover:bg-gray-50 ${isActionLoading ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getTypeIcon(phoneNumber.type)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {phoneNumber.number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {phoneNumber.countryCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {phoneNumber.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {phoneNumber.provider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${phoneNumber.cost.toFixed(2)}/mo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(phoneNumber.status)}`}>
                        <span className="mr-1">{getStatusIcon(phoneNumber.status)}</span>
                        {phoneNumber.status.charAt(0).toUpperCase() + phoneNumber.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {phoneNumber.capabilities.slice(0, 2).map((capability) => (
                          <span
                            key={capability}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {capability}
                          </span>
                        ))}
                        {phoneNumber.capabilities.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            +{phoneNumber.capabilities.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {phoneNumber.assignedAgents.length > 0 
                        ? `${phoneNumber.assignedAgents.length} assigned`
                        : 'None'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/phone-numbers/${phoneNumber.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleEditPhoneNumber(phoneNumber)}
                          disabled={isActionLoading}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(phoneNumber.id)}
                          disabled={isActionLoading}
                          className={`${
                            phoneNumber.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {phoneNumber.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deletePhoneNumber(phoneNumber.id)}
                          disabled={isActionLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Phone Number Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {phoneNumbers.length}
            </div>
            <div className="text-sm text-gray-500">Total Numbers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {phoneNumbers.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {phoneNumbers.filter(p => p.status === 'inactive').length}
            </div>
            <div className="text-sm text-gray-500">Inactive</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              ${phoneNumbers.reduce((sum, p) => sum + p.cost, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Monthly Cost</div>
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
  );
};