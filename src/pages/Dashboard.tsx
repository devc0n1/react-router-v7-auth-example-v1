import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useAsync } from '../hooks/useApi';
import { dashboardService } from '../services/dashboardService';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch dashboard data using our API hook
  const { data: stats, loading: statsLoading, error: statsError } = useAsync(
    () => dashboardService.getStats(),
    []
  );

  const { data: activities, loading: activitiesLoading, error: activitiesError } = useAsync(
    () => dashboardService.getRecentActivity(5),
    []
  );

  const { data: userActivity, loading: userActivityLoading } = useAsync(
    () => user ? dashboardService.getUserActivitySummary(user.id) : Promise.resolve(null),
    [user?.id]
  );

  const currentTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Loading component
  const LoadingSpinner = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  );

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
            {user && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  <strong>Email:</strong> {user.email}<br />
                  <strong>Role:</strong> {user.role}<br />
                  <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* System Stats */}
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
              System Stats
            </h3>
            {statsLoading ? (
              <LoadingSpinner />
            ) : statsError ? (
              <div style={{ color: '#dc3545', padding: '1rem', textAlign: 'center' }}>
                Failed to load stats
              </div>
            ) : stats ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Total Agents:</span>
                  <span style={{ fontWeight: 'bold', color: '#007bff' }}>{stats.totalAgents}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Active Agents:</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>{stats.activeAgents}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Total Requests:</span>
                  <span style={{ fontWeight: 'bold', color: '#6f42c1' }}>{stats.totalRequests.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Avg Response Time:</span>
                  <span style={{ fontWeight: 'bold', color: '#fd7e14' }}>{stats.averageResponseTime}ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>System Uptime:</span>
                  <span style={{ fontWeight: 'bold', color: '#20c997' }}>{stats.systemUptime}</span>
                </div>
              </div>
            ) : null}
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
            {activitiesLoading ? (
              <LoadingSpinner />
            ) : activitiesError ? (
              <div style={{ color: '#dc3545', padding: '1rem', textAlign: 'center' }}>
                Failed to load activities
              </div>
            ) : activities && activities.length > 0 ? (
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0, 
                color: '#666' 
              }}>
                {activities.map((activity, index) => (
                  <li key={activity.id} style={{ 
                    padding: '0.5rem 0', 
                    borderBottom: index < activities.length - 1 ? '1px solid #eee' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{activity.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div>{activity.message}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>{activity.timestamp}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>
                No recent activity
              </div>
            )}
          </div>

          {/* User Activity Summary */}
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
              Your Activity
            </h3>
            {userActivityLoading ? (
              <LoadingSpinner />
            ) : userActivity ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Total Logins:</span>
                  <span style={{ fontWeight: 'bold', color: '#007bff' }}>{userActivity.loginCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Agents Created:</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>{userActivity.agentsCreated}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Agents Modified:</span>
                  <span style={{ fontWeight: 'bold', color: '#ffc107' }}>{userActivity.agentsModified}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Total Sessions:</span>
                  <span style={{ fontWeight: 'bold', color: '#6f42c1' }}>{userActivity.totalSessions}</span>
                </div>
              </div>
            ) : null}
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
              <li><strong>Dashboard:</strong> Current page with overview and real-time stats</li>
              <li><strong>Agents:</strong> Manage AI agents with full CRUD operations</li>
              <li><strong>Logout:</strong> End your session securely</li>
            </ul>
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: '#e7f3ff', 
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              💡 <strong>API Integration:</strong> All data is now loaded dynamically from HTTP API calls with proper loading states and error handling.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};