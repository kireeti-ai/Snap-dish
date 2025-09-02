import React, { useContext, useState, useEffect } from 'react';
import './OrderSuccess.css';
import { StoreContext } from '../../Context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';

const CheckmarkIcon = () => (
  <svg className="checkmark-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
  </svg>
);

const OrderSuccess = () => {
  const { orders, userName } = useContext(StoreContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const navigate = useNavigate();

  const lastOrder = orders.length > 0 ? orders[orders.length - 1] : null;

  useEffect(() => {
    if (!lastOrder) {
      navigate('/');
    }
  }, [lastOrder, navigate]);

  if (!lastOrder) {
    return null;
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your feedback! You rated the experience ${rating} stars.`);
  };

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-header">
          <CheckmarkIcon />
          <h1>Order Confirmed!</h1>
          <p>Thank you, {userName || 'Customer'}! Your order from <strong>{lastOrder.restaurant}</strong> is on its way.</p>
          <p className="email-info">A confirmation has been sent to your email address.</p>
        </div>

        <div className="order-summary-card">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <p><strong>Order ID:</strong> #{lastOrder.id}</p>
            <p><strong>Estimated Arrival:</strong> 30-45 Minutes</p>
            <p><strong>Deliver To:</strong> {lastOrder.deliveryInfo.street}, {lastOrder.deliveryInfo.city}</p>
          </div>
          <div className="summary-items">
            <h4>Items Ordered</h4>
            {lastOrder.items.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.quantity} x {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total Paid</span>
            <strong>₹{lastOrder.total}</strong>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/my-orders" className="btn-primary">Track Your Order</Link>
          <Link to="/" className="btn-secondary">Continue Shopping</Link>
        </div>

        <div className="review-card">
          <h3>How was your ordering experience?</h3>
          <p>Your feedback helps us improve our service.</p>
          <form onSubmit={handleFeedbackSubmit}>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={ratingValue}
                    className={ratingValue <= (hover || rating) ? "on" : "off"}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <span className="star">&#9733;</span>
                  </button>
                );
              })}
            </div>
            <textarea placeholder="Tell us more... (optional)"></textarea>
            <button type="submit" className="btn-primary">Submit Feedback</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;