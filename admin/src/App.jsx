import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ManageRequests from './components/ManageRequests';
import ManageRestaurants from './components/ManageRestaurants';
import ManageUsers from './components/ManageUsers';
import AdminOrdersDashboard from './components/ViewOrders';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import ManageCreators from './components/ManageCreators';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
useEffect(() => {
    const validateToken = async () => {
        try {
            setIsValidatingToken(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setIsAdminAuthenticated(false);
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.get(
                `${API_BASE_URL}/api/users/validate-token`,
                config
            );

            if (response.data.success && response.data.role === 'admin') {
                setIsAdminAuthenticated(true);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error('Token validation error:', error);
            handleLogout();
        } finally {
            setIsValidatingToken(false);
        }
    };

    validateToken();
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['X-CSRF-TOKEN'];
    setIsAdminAuthenticated(false);
  };

  if (isValidatingToken) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <ErrorBoundary>
      {isAdminAuthenticated ? (
        <div className="app-container">
          <Sidebar handleLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/requests" element={<ManageRequests />} />
              <Route path="/restaurants" element={<ManageRestaurants />} />
              <Route path="/users" element={<ManageUsers />} />
              <Route path="/orders" element={<AdminOrdersDashboard/>} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/manage-creators" element={<ManageCreators />} />
            </Routes>
          </main>
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      ) : (
        <LoginPage onLoginSuccess={() => setIsAdminAuthenticated(true)} />
      )}
    </ErrorBoundary>
  );
}

export default App;