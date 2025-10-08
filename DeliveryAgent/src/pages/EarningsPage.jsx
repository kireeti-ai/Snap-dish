import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './EarningsPage.css';

const mockEarnings = [
  { id: 'ORD-12344', amount: 55.00, time: '10:30 AM', date: '2025-10-07', distance: '5.2 km' },
  { id: 'ORD-12343', amount: 48.50, time: '09:15 AM', date: '2025-10-07', distance: '3.8 km' },
  { id: 'ORD-12342', amount: 62.00, time: '02:45 PM', date: '2025-10-06', distance: '6.5 km' },
  { id: 'ORD-12341', amount: 71.25, time: '11:20 AM', date: '2025-10-06', distance: '8.1 km' },
  { id: 'ORD-12340', amount: 45.75, time: '08:30 AM', date: '2025-10-05', distance: '4.2 km' },
  { id: 'ORD-12339', amount: 58.00, time: '01:15 PM', date: '2025-10-05', distance: '5.9 km' },
  { id: 'ORD-12338', amount: 52.50, time: '03:45 PM', date: '2025-10-04', distance: '4.8 km' },
];

const EarningsPage = () => {
  const [chartType, setChartType] = useState('bar');

  const todayEarnings = mockEarnings
    .filter(e => e.date === '2025-10-07')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalEarnings = mockEarnings.reduce((acc, curr) => acc + curr.amount, 0);

  const chartData = mockEarnings.reduce((acc, earning) => {
    const dateObj = new Date(earning.date);
    const dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.date === dateLabel);

    if (existing) {
      existing.earnings += earning.amount;
      existing.deliveries += 1;
    } else {
      acc.push({
        date: dateLabel,
        earnings: earning.amount,
        deliveries: 1
      });
    }
    return acc;
  }, []).reverse();

  // Function to handle downloading the report as a CSV file
  const handleDownload = () => {
    const headers = ['Order ID', 'Date', 'Time', 'Distance (km)', 'Amount (₹)'];
    
    // Convert data to CSV format
    const csvRows = mockEarnings.map(row => 
      [
        row.id,
        row.date,
        row.time,
        row.distance.replace(' km', ''), // Remove unit for clean data
        row.amount.toFixed(2)
      ].join(',')
    );

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'earnings-report.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="earnings-page">
      <div className="earnings-container">
        <h2 className="earnings-title">Earnings Report</h2>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card card-green">
            <p className="card-title">Today's Earnings</p>
            <p className="card-amount">₹{todayEarnings.toFixed(2)}</p>
            <p className="card-subtext">{mockEarnings.filter(e => e.date === '2025-10-07').length} deliveries</p>
          </div>
          <div className="summary-card card-blue">
            <p className="card-title">Total Earnings</p>
            <p className="card-amount">₹{totalEarnings.toFixed(2)}</p>
            <p className="card-subtext">{mockEarnings.length} total deliveries</p>
          </div>
          <div className="summary-card card-purple">
            <p className="card-title">Average per Delivery</p>
            <p className="card-amount">₹{(totalEarnings / mockEarnings.length).toFixed(2)}</p>
            <p className="card-subtext">Last 7 days</p>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Earnings Trend</h3>
            <div className="chart-buttons">
              <button 
                className={chartType === 'bar' ? 'active' : 'inactive'}
                onClick={() => setChartType('bar')}
              >
                Bar Chart
              </button>
              <button 
                className={chartType === 'line' ? 'active' : 'inactive'}
                onClick={() => setChartType('line')}
              >
                Line Chart
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Earnings']} contentStyle={{ borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="earnings" fill="#3b82f6" name="Daily Earnings (₹)" radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Earnings']} contentStyle={{ borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={3} name="Daily Earnings (₹)" dot={{ fill: '#3b82f6', r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Earnings Table */}
        <div className="table-card">
          <div className="table-header">
            Detailed Earnings Report
            {/* --- NEW: Download Button --- */}
            <button className="download-btn" onClick={handleDownload}>
              Download Report
            </button>
          </div>
          <div className="table-wrapper">
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Distance</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockEarnings.map(earning => (
                  <tr key={earning.id}>
                    <td>{earning.id}</td>
                    <td>{new Date(earning.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>{earning.time}</td>
                    <td>{earning.distance}</td>
                    <td className="earnings-amount">₹{earning.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="tfoot-label">Total Earnings:</td>
                  <td className="tfoot-value">₹{totalEarnings.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EarningsPage;