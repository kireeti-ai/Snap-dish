import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../App.css'
import './Dashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const Dashboard = () => {
    const [stats, setStats] = useState({
        overview: {
            totalOrders: 0,
            totalRevenue: 0,
            activeCustomers: 0,
            activeRestaurants: 0
        },
        ordersByStatus: [],
        recentOrders: [],
        dailyRevenue: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            };

            const response = await axios.get(`${API_BASE_URL}/api/admin/statistics`, config);

            if (response.data.success) {
                setStats(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch dashboard data');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error loading dashboard data';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader"></div>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <h2>Error Loading Dashboard</h2>
                <p>{error}</p>
                <button onClick={fetchDashboardData}>Try Again</button>
            </div>
        );
    }

    // Calculate max revenue for chart scaling
    const maxRevenue = stats.dailyRevenue.length > 0 
        ? Math.max(...stats.dailyRevenue.map(d => d.total))
        : 0;

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            
            {/* Overview Cards */}
            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{stats.overview.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p className="stat-number">₹{stats.overview.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Customers</h3>
                    <p className="stat-number">{stats.overview.activeCustomers}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Restaurants</h3>
                    <p className="stat-number">{stats.overview.activeRestaurants}</p>
                </div>
            </div>

            {/* Orders by Status */}
            <div className="orders-status-section">
                <h2>Orders by Status</h2>
                <div className="orders-status-grid">
                    {stats.ordersByStatus.map(status => (
                        <div key={status._id} className="status-card">
                            <h4>{status._id}</h4>
                            <p>{status.count} orders</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="recent-orders-section">
                <h2>Recent Orders</h2>
                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Restaurant</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.user?.name || 'N/A'}</td>
                                        <td>{order.restaurant?.name || 'N/A'}</td>
                                        <td>₹{order.amount.toFixed(2)}</td>
                                        <td>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No recent orders
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Daily Revenue Chart */}
            <div className="revenue-chart-section">
                <h2>Daily Revenue</h2>
                {stats.dailyRevenue.length > 0 ? (
                    <div className="revenue-chart">
                        {stats.dailyRevenue.map(day => {
                            const heightPercent = maxRevenue > 0 
                                ? (day.total / maxRevenue) * 100 
                                : 0;
                            
                            return (
                                <div key={day._id} className="revenue-bar">
                                    <span className="amount">₹{day.total.toFixed(2)}</span>
                                    <div 
                                        className="bar" 
                                        style={{ 
                                            height: `${Math.max(heightPercent, 5)}%`,
                                            minHeight: heightPercent > 0 ? '20px' : '5px'
                                        }}
                                    ></div>
                                    <span className="date">
                                        {new Date(day._id).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ 
                        background: 'white', 
                        padding: '3rem', 
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: '#666'
                    }}>
                        No revenue data available
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;