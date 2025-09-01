import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Navbar({ setActiveComponent }) {
  const navigate = useNavigate();

const handleLogout = () => {
  authService.logout();
  navigate('/login'); // This correctly navigates to the login page
};

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">Restaurant Dashboard</h1>
      <div className="nav-links">
        <button onClick={() => setActiveComponent('Profile')}>Profile</button>
        <button onClick={() => setActiveComponent('Menu')}>Menu</button>
        <button onClick={() => setActiveComponent('Orders')}>Orders</button>
        <button onClick={() => setActiveComponent('Earnings')}>Dashboard</button>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;