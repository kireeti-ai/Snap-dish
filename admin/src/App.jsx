import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ManageRequests from './components/ManageRequests'; // Import the new component
import ManageRestaurants from './components/ManageRestaurants';
import ManageCustomers from './components/ManageCustomers';
import ManageDeliveryPartners from './components/ManageDeliveryPartners';
import ViewOrders from './components/ViewOrders';
import Settings from './components/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests" element={<ManageRequests />} /> {/* Add this route */}
            <Route path="/restaurants" element={<ManageRestaurants />} />
            <Route path="/customers" element={<ManageCustomers />} />
            <Route path="/delivery-partners" element={<ManageDeliveryPartners />} />
            <Route path="/orders" element={<ViewOrders />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;