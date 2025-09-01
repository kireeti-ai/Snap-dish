import React, { useState } from 'react';

const mockOrders = [
  { id: 'ORD-001', customer: 'Alice', restaurant: 'Pizza Place', total: 25.50, status: 'Delivered' },
  { id: 'ORD-002', customer: 'Bob', restaurant: 'Sushi Spot', total: 42.00, status: 'In Progress' },
  { id: 'ORD-003', customer: 'Charlie', restaurant: 'Burger Barn', total: 15.75, status: 'Cancelled' },
];

function ViewOrders() {
  const [orders, setOrders] = useState(mockOrders);

  return (
    <div className="page">
      <h2>All Orders and Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Restaurant</th>
            <th>Total ($)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.restaurant}</td>
              <td>{order.total.toFixed(2)}</td>
              <td>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewOrders;