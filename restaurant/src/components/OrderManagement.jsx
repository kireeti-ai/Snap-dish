import React, { useState, useEffect } from 'react';

// Mock data for incoming orders
const initialOrders = [
  { id: 101, customer: 'John Doe', items: ['Pizza', 'Coke'], status: 'Pending' },
  { id: 102, customer: 'Jane Smith', items: ['Burger', 'Fries'], status: 'Pending' },
  { id: 103, customer: 'Peter Jones', items: ['Pasta'], status: 'Accepted' },
];

function OrderManagement() {
  const [orders, setOrders] = useState(initialOrders);

  // Simulate receiving a new order every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newOrder = {
        id: Math.floor(Math.random() * 1000),
        customer: 'New Customer',
        items: ['Random Item'],
        status: 'Pending',
      };
      setOrders(prevOrders => [newOrder, ...prevOrders]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const otherOrders = orders.filter(o => o.status !== 'Pending');

  return (
    <div className="management-container">
      <h2>Order Management</h2>
      <div className="order-section">
        <h3>New Orders</h3>
        {pendingOrders.length > 0 ? (
          pendingOrders.map(order => (
            <div key={order.id} className="order-card pending">
              <h4>Order #{order.id} - {order.customer}</h4>
              <p>Items: {order.items.join(', ')}</p>
              <div className="actions">
                <button className="btn-accept" onClick={() => handleStatusChange(order.id, 'Accepted')}>Accept</button>
                <button className="btn-reject" onClick={() => handleStatusChange(order.id, 'Rejected')}>Reject</button>
              </div>
            </div>
          ))
        ) : (
          <p>No new orders at the moment.</p>
        )}
      </div>
      <div className="order-section">
        <h3>Processed Orders</h3>
        {otherOrders.map(order => (
          <div key={order.id} className={`order-card ${order.status.toLowerCase()}`}>
            <h4>Order #{order.id} - {order.customer}</h4>
            <p>Items: {order.items.join(', ')}</p>
            <p><strong>Status: {order.status}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderManagement;