import React from 'react';

// Mock data for analytics
const analyticsData = {
  totalOrders: 1250,
  totalRevenue: 54300,
  activeCustomers: 350,
  activeRestaurants: 45,
};

function Dashboard() {
  return (
    <div className="page">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{analyticsData.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${analyticsData.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Active Customers</h3>
          <p>{analyticsData.activeCustomers}</p>
        </div>
        <div className="stat-card">
          <h3>Active Restaurants</h3>
          <p>{analyticsData.activeRestaurants}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;