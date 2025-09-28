import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaTruck } from 'react-icons/fa';
 // We'll need some CSS for the new look

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const url = 'https://snap-dish.onrender.com'; // Assuming your backend URL

  // Fetch all orders when the component mounts
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        // Assumes you have a valid admin token stored
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${url}/api/order/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          toast.error('Failed to fetch orders');
        }
      } catch (error) {
        toast.error('An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, [url]);

  // Handle status updates and make an API call
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${url}/api/order/status`, 
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update the order status in the local state for immediate feedback
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success('Order status updated!');
      } else {
        toast.error('Failed to update status.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    }
  };

  // Memoize filtered orders to avoid re-calculating on every render
  const filteredOrders = useMemo(() => {
    if (filter === 'All') {
      return orders;
    }
    return orders.filter(order => order.status === filter);
  }, [orders, filter]);

  // Summary stats
  const orderStats = useMemo(() => ({
    total: orders.length,
    inProgress: orders.filter(o => ['Order Placed', 'Preparing', 'Out for Delivery'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
  }), [orders]);


  if (loading) {
    return <div className="admin-page">Loading orders...</div>;
  }

  return (
    <div className="admin-page">
      <h2>Orders Dashboard</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
            <h4>Total Orders</h4>
            <p>{orderStats.total}</p>
            <FaBoxOpen className="stat-icon" />
        </div>
        <div className="stat-card">
            <h4>In Progress</h4>
            <p>{orderStats.inProgress}</p>
            <FaTruck className="stat-icon in-progress"/>
        </div>
        <div className="stat-card">
            <h4>Delivered</h4>
            <p>{orderStats.delivered}</p>
            <FaCheckCircle className="stat-icon delivered"/>
        </div>
        <div className="stat-card">
            <h4>Cancelled</h4>
            <p>{orderStats.cancelled}</p>
            <FaTimesCircle className="stat-icon cancelled"/>
        </div>
      </div>

      <div className="filter-controls">
        {['All', 'Order Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
          <button 
            key={status} 
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="orders-table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total ($)</th>
              <th>Delivery Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6)}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</td>
                <td>₹{order.amount.toFixed(2)}</td>
                <td>{order.address.street}, {order.address.city}</td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`status-select status-${order.status.toLowerCase().replace(/ /g, '-')}`}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersDashboard;