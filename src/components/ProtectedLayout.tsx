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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
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

  const NavLink = ({ to, icon, children }: { to: string; icon: string; children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`
          flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200
          border-l-3 ${isActive 
            ? 'text-blue-600 bg-blue-50 border-blue-600 font-semibold' 
            : 'text-gray-700 border-transparent hover:bg-gray-50'
          }
        `}
      >
        <span className="text-lg">{icon}</span>
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Navigation Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col min-h-screen">
        {/* Logo/Brand */}
        <div className="px-4 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">React Router v7</h2>
          <p className="text-sm text-gray-600 mt-1">Auth Example</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4">
          <div className="space-y-1">
            <NavLink to="/dashboard" icon="📊">Dashboard</NavLink>
            <NavLink to="/agents" icon="🎤">Voice Agents</NavLink>
            <NavLink to="/phone-numbers" icon="📞">Phone Numbers</NavLink>
          </div>
        </nav>

        {/* User Info and Logout */}
        <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Signed in as</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{user?.username}</span>
                {user?.role && (
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}
                  `}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-2 px-3 py-2 
                bg-red-500 hover:bg-red-600 disabled:bg-gray-400 
                text-white font-semibold rounded-md transition-colors
                disabled:cursor-not-allowed
              "
            >
              {loading && (
                <div className="w-3 h-3 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
              )}
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white px-8 py-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {location.pathname === '/dashboard' ? 'Dashboard' : 
                 location.pathname === '/agents' ? 'Voice Agents' : 
                 location.pathname === '/phone-numbers' ? 'Phone Numbers' : 'Application'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {location.pathname === '/dashboard' ? 'Monitor your application metrics and activity' : 
                 location.pathname === '/agents' ? 'Manage and configure your voice agents' : 
                 location.pathname === '/phone-numbers' ? 'Manage phone numbers and assign them to agents' : 'Welcome to the application'}
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};