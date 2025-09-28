import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ManageRequests from './components/ManageRequests';
import ManageRestaurants from './components/ManageRestaurants';
import ManageUsers from './components/ManageUsers'; // <-- IMPORT a
import AdminOrdersDashboard from './components/ViewOrders';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import './App.css';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

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
        <div className="app-container">
          <Sidebar handleLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/requests" element={<ManageRequests />} />
              <Route path="/restaurants" element={<ManageRestaurants />} />
              {/* CONSOLIDATED ROUTES */}
              <Route path="/users" element={<ManageUsers />} /> 
              <Route path="/orders" element={<AdminOrdersDashboard/>} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      ) : (
        <LoginPage onLoginSuccess={() => setIsAdminAuthenticated(true)} />
      )}
    </Router>
  );
}

export default App;