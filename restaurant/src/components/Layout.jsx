import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet /> {/* Child routes will render here */}
      </main>
      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
        </NavLink>
        <NavLink to="/earnings" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            Earnings
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
            Profile
        </NavLink>
      </nav>
    </>
  );
};

export default Layout;