// src/components/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ handleLogout }) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Admin Panel</h1>
      <nav className="sidebar-nav">
        <NavLink to="/"> Dashboard</NavLink>
        <NavLink to="/requests">Manage Requests</NavLink>
        <NavLink to="/restaurants"> Manage Restaurants</NavLink>
        <NavLink to="/customers"> Manage Customers</NavLink>
        <NavLink to="/delivery-partners"> Manage Delivery</NavLink>
        <NavLink to="/orders"> View Orders</NavLink>
        <NavLink to="/settings"> Settings</NavLink>
      </nav>
      {/* Add Logout Button at the bottom */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </aside>
  );
}

export default Sidebar;