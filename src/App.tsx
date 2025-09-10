import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { ProtectedLayout } from './components/ProtectedLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Agents } from './pages/Agents';
import { PhoneNumbers } from './pages/PhoneNumbers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedLayout>
                <Agents />
              </ProtectedLayout>
            }
          />
          <Route
            path="/phone-numbers"
            element={
              <ProtectedLayout>
                <PhoneNumbers />
              </ProtectedLayout>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
