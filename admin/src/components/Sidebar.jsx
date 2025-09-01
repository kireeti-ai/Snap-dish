import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Admin Panel</h1>
      <nav className="sidebar-nav">
        <NavLink to="/">📊 Dashboard</NavLink>
        <NavLink to="/requests">🔔 Manage Requests</NavLink> {/* Add this line */}
        <NavLink to="/restaurants">🍔 Manage Restaurants</NavLink>
        <NavLink to="/customers">👥 Manage Customers</NavLink>
        <NavLink to="/delivery-partners">🛵 Manage Delivery</NavLink>
        <NavLink to="/orders">📋 View Orders</NavLink>
        <NavLink to="/settings">⚙️ Settings</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;