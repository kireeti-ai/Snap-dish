// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ManageRequests from './components/ManageRequests';
import ManageRestaurants from './components/ManageRestaurants';
import ManageCustomers from './components/ManageCustomers';
import ManageDeliveryPartners from './components/ManageDeliveryPartners';
import ViewOrders from './components/ViewOrders';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage'; // Import the new LoginPage
import './App.css';

function App() {
  // State to track if the admin is authenticated
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check for the token in localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdminAuthenticated(false);
  };

  return (
    <Router>
      {isAdminAuthenticated ? (
        // If authenticated, show the admin dashboard
        <div className="app-container">
          <Sidebar handleLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/requests" element={<ManageRequests />} />
              <Route path="/restaurants" element={<ManageRestaurants />} />
              <Route path="/customers" element={<ManageCustomers />} />
              <Route path="/delivery-partners" element={<ManageDeliveryPartners />} />
              <Route path="/orders" element={<ViewOrders />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      ) : (
        // If not authenticated, show the login page
        <LoginPage onLoginSuccess={() => setIsAdminAuthenticated(true)} />
      )}
    </Router>
  );
}

export default App;