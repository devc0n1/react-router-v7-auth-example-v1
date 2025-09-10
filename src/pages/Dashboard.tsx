import React from 'react';
import { useAuth } from '../components/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const currentTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div>
      <h1 style={{ 
        color: '#333', 
        marginBottom: '2rem',
        fontSize: '2.5rem',
        fontWeight: 'bold'
      }}>
        Dashboard
      </h1>
      
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Welcome Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h2 style={{ 
            color: '#007bff', 
            marginTop: 0, 
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            Welcome back, {user?.username}! 👋
          </h2>
          <p style={{ color: '#666', margin: 0, lineHeight: '1.5' }}>
            You have successfully logged in to the React Router v7 authentication example.
            This dashboard is only accessible to authenticated users.
          </p>
          <p style={{ color: '#888', margin: '1rem 0 0 0', fontSize: '0.9rem' }}>
            Current time: {currentTime}
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ 
            color: '#333', 
            marginTop: 0, 
            marginBottom: '1.5rem',
            fontSize: '1.25rem'
          }}>
            Quick Stats
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Active Sessions:</span>
              <span style={{ fontWeight: 'bold', color: '#28a745' }}>1</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Login Time:</span>
              <span style={{ fontWeight: 'bold', color: '#007bff' }}>Just now</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>User Role:</span>
              <span style={{ fontWeight: 'bold', color: '#6f42c1' }}>Admin</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ 
            color: '#333', 
            marginTop: 0, 
            marginBottom: '1.5rem',
            fontSize: '1.25rem'
          }}>
            Recent Activity
          </h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            color: '#666' 
          }}>
            <li style={{ 
              padding: '0.5rem 0', 
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ color: '#28a745', fontSize: '1.2rem' }}>✓</span>
              Successfully logged in
            </li>
            <li style={{ 
              padding: '0.5rem 0', 
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ color: '#007bff', fontSize: '1.2rem' }}>🏠</span>
              Accessed Dashboard
            </li>
            <li style={{ 
              padding: '0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ color: '#ffc107', fontSize: '1.2rem' }}>🔄</span>
              Session initialized
            </li>
          </ul>
        </div>

        {/* Navigation Helper */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ 
            color: '#333', 
            marginTop: 0, 
            marginBottom: '1.5rem',
            fontSize: '1.25rem'
          }}>
            Navigation
          </h3>
          <p style={{ color: '#666', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
            Explore the application using the navigation menu above:
          </p>
          <ul style={{ 
            color: '#666', 
            paddingLeft: '1.5rem',
            margin: 0,
            lineHeight: '1.8'
          }}>
            <li><strong>Dashboard:</strong> Current page with overview</li>
            <li><strong>Agents:</strong> Manage AI agents and their status</li>
            <li><strong>Logout:</strong> End your session securely</li>
          </ul>
        </div>
      </div>
    </div>
  );
};