import React, { useState } from 'react';
import Navbar from './navbar.jsx';
import ProfileManagement from './ProfileManagement';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import Earnings from './Earnings';

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('Orders'); // Default view

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Profile':
        return <ProfileManagement />;
      case 'Menu':
        return <MenuManagement />;
      case 'Orders':
        return <OrderManagement />;
      case 'Earnings':
        return <Earnings />;
      default:
        return <OrderManagement />;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar setActiveComponent={setActiveComponent} />
      <main className="dashboard-content">
        {renderComponent()}
      </main>
    </div>
  );
}

export default Dashboard;