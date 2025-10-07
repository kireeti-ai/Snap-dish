import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import OrderStatusTracker from '../../components/OrderStatusTracker/OrderStatusTracker';
import { FaShoppingBag } from 'react-icons/fa';

const MyOrders = () => {

  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
    const { orders, socket } = useContext(StoreContext); // <-- Get socket from context


  useEffect(() => {
    const allOrders = orders || [];
    
    // --- FIX: Added the missing active statuses ---
    const active = allOrders.filter(order => 
      [
        'Pending Confirmation', // For newly placed orders
        'Order Placed', 
        'Preparing', 
        'Awaiting Delivery Agent', // When food is ready for pickup
        'Out for Delivery'
      ].includes(order.status)
    );

    const past = allOrders.filter(order => ['Delivered', 'Cancelled'].includes(order.status));
    
    setActiveOrders(active);
    setPastOrders(past);
  }, [orders]);

  const openReviewModal = (order) => { setSelectedOrder(order); setIsModalOpen(true); };
  const closeReviewModal = () => { setIsModalOpen(false); setSelectedOrder(null); };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderOrderCard = (order, isActive = false) => (
    <motion.div key={order._id} className="order-card" variants={cardVariants} layout>
      <div className="order-card-header">
        <div className="restaurant-info">
          <h3>Order #{order._id.slice(-6)}</h3>
          <p>{new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div className={`order-status ${order.status.toLowerCase().replace(/ /g, '-')}`}>
          {order.status}
        </div>
      </div>
      
      {isActive && <OrderStatusTracker status={order.status} />}

      <div className="order-items-list">
        {order.items.map((item, index) => (
          <p key={index} className="order-item">{item.quantity} x {item.name}</p>
        ))}
      </div>

      <div className="order-card-footer">
        <p className="order-total">Total: ₹{order.amount}</p>
        <div className="order-actions">
          {order.status === 'Delivered' && (
            <>
              <button className="reorder-btn">Reorder</button>
              <button className="review-btn" onClick={() => openReviewModal(order)}>Write Review</button>
            </>
          )}
          {order.status === 'Cancelled' && (
            <p className="cancelled-text">This order was cancelled.</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>
      <section className="orders-section">
        <h2>Active Orders</h2>
        <div className="orders-list">
          <AnimatePresence>
            {activeOrders.length > 0 ? (
              activeOrders.map(order => renderOrderCard(order, true))
            ) : (
              <motion.div className="no-orders-message" initial={{opacity: 0}} animate={{opacity: 1}}>
                <FaShoppingBag size={40} />
                <p>You have no active orders right now.</p>
                <span>Why not treat yourself to something delicious?</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="orders-section">
        <h2>Order History</h2>
        <div className="orders-list">
          <AnimatePresence>
            {pastOrders.length > 0 ? (
              pastOrders.map(order => renderOrderCard(order, false))
            ) : (
              <motion.div className="no-orders-message" initial={{opacity: 0}} animate={{opacity: 1}}>
                <FaShoppingBag size={40} />
                <p>You haven't placed any orders yet.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      {/* Your existing Review Modal logic can remain here without changes */}
    </div>
  );
};

export default MyOrders;