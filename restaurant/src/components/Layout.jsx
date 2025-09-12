import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Use the corrected Navbar

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="dashboard-content">
        <Outlet /> {/* Child routes from App.js will render here */}
      </main>
    </>
  );
};

export default Layout;