import React from 'react';
import type { ReactNode } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner during auth check
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#666', margin: 0 }}>Authenticating...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation to login even if logout API call fails
      window.location.pathname = '/login';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex' }}>
      {/* Left Navigation Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: '#fff',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Logo/Brand */}
        <div style={{
          padding: '1.5rem 1rem',
          borderBottom: '1px solid #e9ecef'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#333', 
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            React Router v7
          </h2>
          <p style={{ 
            margin: '0.25rem 0 0 0', 
            color: '#666', 
            fontSize: '0.9rem' 
          }}>
            Auth Example
          </p>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Link 
              to="/dashboard" 
              style={{ 
                textDecoration: 'none', 
                color: location.pathname === '/dashboard' ? '#007bff' : '#495057',
                backgroundColor: location.pathname === '/dashboard' ? '#e7f3ff' : 'transparent',
                padding: '0.75rem 1rem',
                borderRadius: '0',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: location.pathname === '/dashboard' ? '600' : 'normal',
                borderLeft: location.pathname === '/dashboard' ? '3px solid #007bff' : '3px solid transparent'
              }}
              onMouseOver={(e) => {
                if (location.pathname !== '/dashboard') {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseOut={(e) => {
                if (location.pathname !== '/dashboard') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>📊</span>
              Dashboard
            </Link>
            <Link 
              to="/agents" 
              style={{ 
                textDecoration: 'none', 
                color: location.pathname === '/agents' ? '#007bff' : '#495057',
                backgroundColor: location.pathname === '/agents' ? '#e7f3ff' : 'transparent',
                padding: '0.75rem 1rem',
                borderRadius: '0',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: location.pathname === '/agents' ? '600' : 'normal',
                borderLeft: location.pathname === '/agents' ? '3px solid #007bff' : '3px solid transparent'
              }}
              onMouseOver={(e) => {
                if (location.pathname !== '/agents') {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseOut={(e) => {
                if (location.pathname !== '/agents') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🎤</span>
              Voice Agents
            </Link>
            <Link 
              to="/phone-numbers" 
              style={{ 
                textDecoration: 'none', 
                color: location.pathname === '/phone-numbers' ? '#007bff' : '#495057',
                backgroundColor: location.pathname === '/phone-numbers' ? '#e7f3ff' : 'transparent',
                padding: '0.75rem 1rem',
                borderRadius: '0',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: location.pathname === '/phone-numbers' ? '600' : 'normal',
                borderLeft: location.pathname === '/phone-numbers' ? '3px solid #007bff' : '3px solid transparent'
              }}
              onMouseOver={(e) => {
                if (location.pathname !== '/phone-numbers') {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseOut={(e) => {
                if (location.pathname !== '/phone-numbers') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>📞</span>
              Phone Numbers
            </Link>
          </div>
        </nav>

        {/* User Info and Logout */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ color: '#666', fontSize: '0.8rem' }}>Signed in as</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ color: '#333' }}>{user?.username}</strong>
                {user?.role && (
                  <span style={{
                    backgroundColor: user.role === 'admin' ? '#6f42c1' : '#28a745',
                    color: 'white',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#6c757d' : '#dc3545',
                color: 'white',
                border: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                width: '100%'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#c82333';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                }
              }}
            >
              {loading && (
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              )}
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: '#fff',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                color: '#333', 
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                {location.pathname === '/dashboard' ? 'Dashboard' : 
                 location.pathname === '/agents' ? 'Voice Agents' : 
                 location.pathname === '/phone-numbers' ? 'Phone Numbers' : 'Application'}
              </h1>
              <p style={{ 
                margin: '0.25rem 0 0 0', 
                color: '#666', 
                fontSize: '0.9rem' 
              }}>
                {location.pathname === '/dashboard' ? 'Monitor your application metrics and activity' : 
                 location.pathname === '/agents' ? 'Manage and configure your voice agents' : 
                 location.pathname === '/phone-numbers' ? 'Manage phone numbers and assign them to agents' : 'Welcome to the application'}
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={{ padding: '2rem', flex: 1 }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};