import React from 'react';

const earningsData = {
  today: 450.75,
  thisWeek: 2890.50,
  thisMonth: 12345.60,
};

const orderHistory = [
  { id: 103, date: '2025-09-01', total: 850.50, status: 'Completed' },
  { id: 102, date: '2025-09-01', total: 1248.00, status: 'Completed' },
  { id: 101, date: '2025-08-31', total: 1599.00, status: 'Completed' },
];

function Earnings() {
  return (
    <div className="management-container">
      <h2>Dashboard & Earnings</h2>

      <div className="earnings-summary">
        <div className="summary-card">
          <h3>Today's Earnings</h3>
          <p>₹{earningsData.today.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>This Week's Earnings</h3>
          <p>₹{earningsData.thisWeek.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>This Month's Earnings</h3>
          <p>₹{earningsData.thisMonth.toFixed(2)}</p>
        </div>
      </div>

      <div className="order-history">
        <h3>Recent Order History</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.date}</td>
                <td>₹{order.total.toFixed(2)}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Earnings;