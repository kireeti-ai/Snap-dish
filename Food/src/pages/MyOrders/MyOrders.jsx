// 1. Import useContext and your StoreContext
import React, { useState, useEffect, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';

// 2. Remove the mockUserOrders constant from this file
// const mockUserOrders = [ ... ];

const MyOrders = () => {
  // 3. Get the real 'orders' array from the context
  const { orders } = useContext(StoreContext);

  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  useEffect(() => {
    // 4. Use the 'orders' from context here instead of mock data
    const allOrders = orders; 
    
    if (allOrders) {
      const active = allOrders.filter(order => 
        order.status === 'Preparing' || order.status === 'Out for Delivery'
      );
      
      const past = allOrders.filter(order => 
        order.status === 'Delivered' || order.status === 'Cancelled'
      );

      setActiveOrders(active);
      setPastOrders(past);
    }
  }, [orders]); // 5. Add 'orders' to the dependency array

  const renderOrderCard = (order) => (
    <div key={order.id} className="order-card">
      <div className="order-card-header">
        <div className="restaurant-info">
          <h3>{order.restaurant}</h3>
          <p>Order #{order.id} • {order.date}</p>
        </div>
        <div className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
          {order.status}
        </div>
      </div>
      <div className="order-items-list">
        {order.items.map((item, index) => (
          <p key={index} className="order-item">{item.quantity} x {item.name}</p>
        ))}
      </div>
      
        <p className="order-total">Total Paid: ₹{order.total}</p>
        {(order.status === 'Preparing' || order.status === 'Out for Delivery') && (
            <button className="track-order-btn">Track Order</button>
        )}
        <div className="order-card-footer">
            <p className="order-total">Total Paid: ₹{order.total}</p>
            
            {/* 🌟 ADD REVIEW BUTTON FOR DELIVERED ORDERS */}
            {order.status === 'Delivered' && (
                <div className="order-actions">
                    <button className="track-order-btn">Track Order</button>
                    <button 
                        className="review-order-btn"
                        onClick={() => openReviewModal(order)}
                    >
                        Write Review
                    </button>
                </div>
            )}
        </div>
      </div>
    
  );

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>

      <section className="orders-section">
        <h2>Active Orders</h2>
        <div className="orders-list">
          {activeOrders.length > 0 ? (
            activeOrders.map(order => renderOrderCard(order))
          ) : (
            <p className="no-orders-message">You have no active orders right now.</p>
          )}
        </div>
      </section>

      <section className="orders-section">
        <h2>Order History</h2>
        <div className="orders-list">
          {pastOrders.length > 0 ? (
            pastOrders.map(order => renderOrderCard(order))
          ) : (
            <p className="no-orders-message">You haven't placed any orders yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyOrders;