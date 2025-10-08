import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CSVLink } from "react-csv";

// Mock data for analytics
const analyticsData = [
  { metric: "Total Orders", value: 1250 },
  { metric: "Total Revenue", value: 54300 },
  { metric: "Active Customers", value: 350 },
  { metric: "Active Restaurants", value: 45 },
];

function Dashboard() {
  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-container" style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {analyticsData.map((item) => (
          <div
            key={item.metric}
            className="stat-card"
            style={{
              flex: 1,
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{item.metric}</h3>
            <p>
              {item.metric === "Total Revenue" ? `$${item.value.toLocaleString()}` : item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Visualization Graph */}
      <div style={{ width: "100%", height: 300, marginBottom: "2rem" }}>
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

      {/* Table Report */}
      <h3>Analytics Report</h3>
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
                {item.metric === "Total Revenue" ? `$${item.value.toLocaleString()}` : item.value}
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