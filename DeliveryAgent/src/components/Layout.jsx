import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet /> {/* Renders the current page component */}
      </main>
      <BottomNav />
    </>
  );
};
export default Layout;