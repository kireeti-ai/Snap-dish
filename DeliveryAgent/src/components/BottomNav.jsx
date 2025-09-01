import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>Dashboard</NavLink>
      <NavLink to="/earnings">Earnings</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </nav>
  );
};
export default BottomNav;