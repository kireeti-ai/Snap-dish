import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { authService } from './services/authService';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Update PrivateRoute to redirect to '/login'
function PrivateRoute({ children }) {
  const user = authService.getCurrentUser();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="app">
      <ErrorBoundary>
        <Routes>
          {/* 1. Define the login route */}
          <Route path="/login" element={<Login />} />

          {/* 2. Make the root path redirect to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 3. Your dashboard route remains the same */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;