import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end data-testid="nav-dashboard">
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Dashboard</span>
      </NavLink>
      <NavLink to="/earnings" data-testid="nav-earnings">
        <span className="nav-icon">💰</span>
        <span className="nav-label">Earnings</span>
      </NavLink>
      <NavLink to="/history" data-testid="nav-history">
        <span className="nav-icon">📋</span>
        <span className="nav-label">History</span>
      </NavLink>
      <NavLink to="/profile" data-testid="nav-profile">
        <span className="nav-icon">👤</span>
        <span className="nav-label">Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;