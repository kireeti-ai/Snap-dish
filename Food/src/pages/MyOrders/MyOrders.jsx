import React, { useState, useEffect, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';

const MyOrders = () => {
  const { orders } = useContext(StoreContext);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  // State to manage the review modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const allOrders = orders || []; // Ensure orders is always an array
    
    const active = allOrders.filter(order => 
      order.status === 'Preparing' || order.status === 'Out for Delivery'
    );
    
    const past = allOrders.filter(order => 
      order.status === 'Delivered' || order.status === 'Cancelled'
    );

    setActiveOrders(active);
    setPastOrders(past);
  }, [orders]);

  // Function to open the modal
  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeReviewModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

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
      <div className="order-card-footer">
        <p className="order-total">Total Paid: ₹{order.total}</p>
        <div className="order-actions">
          {(order.status === 'Preparing' || order.status === 'Out for Delivery') && (
            <button className="track-order-btn">Track Order</button>
          )}
          {order.status === 'Delivered' && (
            <>
              <button className="track-order-btn">Reorder</button>
              <button 
                className="review-order-btn"
                onClick={() => openReviewModal(order)}
              >
                Write Review
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
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

      {/* Review Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeReviewModal}>&times;</button>
            <h2>Review your order from {selectedOrder.restaurant}</h2>
            <p>Your feedback helps other food lovers!</p>
            <form className="review-form">
                <div className="star-rating">
                    {/* Simple star rating placeholder */}
                    <span>★★★★★</span>
                </div>
                <textarea placeholder="Tell us about your experience..." rows="5"></textarea>
                <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;