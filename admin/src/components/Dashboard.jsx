import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStatistics(response.data.data);
      } else {
        toast.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Statistics fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Admin Dashboard</h2>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="page">
        <h2>Admin Dashboard</h2>
        <p>No data available</p>
      </div>
    );
  }

  const { overview, ordersByStatus, recentOrders, dailyRevenue } = statistics;

  const analyticsData = [
    { metric: "Total Orders", value: overview.totalOrders },
    { metric: "Total Revenue", value: parseFloat(overview.totalRevenue) },
    { metric: "Active Customers", value: overview.activeCustomers },
    { metric: "Active Restaurants", value: overview.activeRestaurants },
  ];

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-container" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {analyticsData.map((item) => (
          <div
            key={item.metric}
            className="stat-card"
            style={{
              flex: "1 1 200px",
              padding: "1.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              textAlign: "center",
              backgroundColor: "#f9fafb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>{item.metric}</h3>
            <p style={{ margin: "0.5rem 0 0 0", fontSize: "1.8rem", fontWeight: "bold", color: "#1e3a8a" }}>
              {item.metric === "Total Revenue" ? `₹${item.value.toLocaleString()}` : item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Daily Revenue Chart */}
      {dailyRevenue && dailyRevenue.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Daily Revenue (Last 7 Days)</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={dailyRevenue}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Overview Bar Chart */}
      <div style={{ width: "100%", height: 300, marginBottom: "2rem" }}>
        <h3>Overview</h3>
        <ResponsiveContainer>
          <BarChart data={analyticsData}>
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders by Status */}
      {ordersByStatus && ordersByStatus.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Orders by Status</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Status</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "right" }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {ordersByStatus.map((item) => (
                <tr key={item._id}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{item._id}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "right" }}>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders && recentOrders.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Recent Orders</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Order ID</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Customer</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Restaurant</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Status</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>#{order._id.slice(-6)}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {order.userId?.firstName} {order.userId?.lastName}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{order.restaurantId?.name || 'N/A'}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{order.status}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem", textAlign: "right" }}>
                    ₹{order.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Analytics Report Table */}
      <h3>Analytics Summary</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Metric</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {analyticsData.map((item) => (
            <tr key={item.metric}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{item.metric}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                {item.metric === "Total Revenue" ? `₹${item.value.toLocaleString()}` : item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Download CSV */}
      <CSVLink
        data={analyticsData}
        filename={"admin_dashboard_report.csv"}
        style={{
          display: "inline-block",
          padding: "0.5rem 1rem",
          backgroundColor: "#4CAF50",
          color: "#fff",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        Download Report
      </CSVLink>
    </div>
  );
}

export default Dashboard;