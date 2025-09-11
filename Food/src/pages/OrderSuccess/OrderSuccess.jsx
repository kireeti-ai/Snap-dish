import React, { useContext, useState, useEffect } from 'react';
import './OrderSuccess.css';
import { StoreContext } from '../../Context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CheckmarkIcon = () => (
  <motion.svg 
    className="checkmark-icon" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 52 52"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
  >
    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
  </motion.svg>
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

  if (!lastOrder) return null;

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your feedback! You rated ${rating} stars.`);
  };

  return (
    <motion.div 
      className="order-success-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="success-container"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="success-header">
          <CheckmarkIcon />
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Order Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Thank you, {userName || 'Customer'}! Your order from <strong>{lastOrder.restaurant}</strong> is on its way.
          </motion.p>
          <p className="email-info">A confirmation has been sent to your email address.</p>
        </div>

        <motion.div 
          className="order-summary-card"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2>Order Summary</h2>
          <div className="summary-details">
            <p><strong>Order ID:</strong> #{lastOrder.id}</p>
            <p><strong>Estimated Arrival:</strong> 30-45 Minutes</p>
            <p><strong>Deliver To:</strong> {lastOrder.deliveryInfo.street}, {lastOrder.deliveryInfo.city}</p>
          </div>
          <div className="summary-items">
            <h4>Items Ordered</h4>
            {lastOrder.items.map((item, index) => (
              <motion.div 
                key={index} 
                className="summary-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <span>{item.quantity} x {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </motion.div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total Paid</span>
            <strong>₹{lastOrder.total}</strong>
          </div>
        </motion.div>

        <motion.div 
          className="action-buttons"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link to="/my-orders" className="btn-primary">Track Your Order</Link>
          <Link to="/" className="btn-secondary">Continue Shopping</Link>
        </motion.div>

        <motion.div 
          className="review-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h3>How was your ordering experience?</h3>
          <p>Your feedback helps us improve our service.</p>
          <form onSubmit={handleFeedbackSubmit}>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <motion.button
                    type="button"
                    key={ratingValue}
                    className={ratingValue <= (hover || rating) ? "on" : "off"}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="star">&#9733;</span>
                  </motion.button>
                );
              })}
            </div>
            <textarea placeholder="Tell us more... (optional)"></textarea>
            <motion.button 
              type="submit" 
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Feedback
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSuccess;