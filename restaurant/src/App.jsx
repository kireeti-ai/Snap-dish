import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Login from './components/Login';
import OrderManagement from './components/OrderManagement';
import MenuManagement from './components/MenuManagement';
import ProfileManagement from './components/ProfileManagement';
import Earnings from './components/Earnings';
import './App.css';

// This component now uses the AuthContext to protect routes.
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// App component with all routes defined
function AppRoutes() {
  return (
    <div className="app">
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* All dashboard pages are now nested inside the Layout */}
          <Route 
            path="/dashboard" 
            element={<PrivateRoute><Layout /></PrivateRoute>}
          >
            <Route index element={<OrderManagement />} /> {/* Default page */}
            <Route path="menu" element={<MenuManagement />} />
            <Route path="profile" element={<ProfileManagement />} />
            <Route path="earnings" element={<Earnings />} />
          </Route>

          {/* Redirect from root to the dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

// The main App wraps everything in the AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;