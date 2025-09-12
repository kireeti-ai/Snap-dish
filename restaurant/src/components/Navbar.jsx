import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatusToggle from './StatusToggle'; // 1. Import the new component

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* 2. Add the StatusToggle component here */}
      <StatusToggle />

      <div className="nav-links">
        <NavLink to="/dashboard" end>Orders</NavLink>
        <NavLink to="/dashboard/menu">Menu</NavLink>
        <NavLink to="/dashboard/profile">Profile</NavLink>
        <NavLink to="/dashboard/earnings">Earnings</NavLink>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;