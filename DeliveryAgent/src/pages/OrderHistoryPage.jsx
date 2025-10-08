import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
    const { API_BASE_URL, token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const fetchOrderHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/delivery/order-history`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                toast.error('Failed to load order history');
            }
        } catch (error) {
            console.error('Order history fetch error:', error);
            toast.error('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAddress = (addr) => {
        if (!addr || typeof addr !== 'object') return 'Address not available';
        return [addr.street, addr.city, addr.state, addr.zip]
            .filter(part => part)
            .join(', ') || 'Address not available';
    };

    const calculateEarnings = (amount) => {
        return amount ? (amount * 0.15).toFixed(2) : '0.00';
    };

    if (loading) {
        return (
            <div className="order-history-page">
                <h2>Order History</h2>
                <div className="loading-message">Loading your delivery history...</div>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="order-history-page">
                <h2>Order History</h2>
                <div className="empty-state">
                    <p>📦 No completed deliveries yet</p>
                    <p className="empty-subtext">Your completed orders will appear here</p>
                </div>
            </div>
        );
    }

    const totalEarnings = orders.reduce((sum, o) => sum + (o.amount || 0) * 0.15, 0).toFixed(2);

    return (
        <div className="order-history-page">
            <h2>Order History</h2>
            
            <div className="history-stats">
                <div className="stat-card">
                    <span className="stat-label">Total Deliveries</span>
                    <span className="stat-value">{orders.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Total Earned</span>
                    <span className="stat-value">₹{totalEarnings}</span>
                </div>
            </div>

            <div className="orders-list">
                {orders.map((order) => (
                    <div 
                        key={order._id} 
                        className="order-card"
                        onClick={() => setSelectedOrder(order)}
                    >
                        <div className="order-header">
                            <span className="order-id">#{order._id.slice(-6)}</span>
                            <span className="order-date">{formatDate(order.date)}</span>
                        </div>
                        
                        <div className="order-body">
                            <div className="order-info">
                                <p className="restaurant-name">
                                    📍 {order.restaurantId?.name || 'Restaurant'}
                                </p>
                                <p className="customer-name">
                                    👤 {order.userId?.firstName || ''} {order.userId?.lastName || ''}
                                </p>
                            </div>
                            
                            <div className="order-amounts">
                                <div className="amount-item">
                                    <span className="amount-label">Order Total</span>
                                    <span className="amount-value">₹{(order.amount || 0).toFixed(2)}</span>
                                </div>
                                <div className="amount-item earnings">
                                    <span className="amount-label">Your Earnings</span>
                                    <span className="amount-value">₹{calculateEarnings(order.amount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="order-footer">
                            <span className="status-badge">{order.status || 'N/A'}</span>
                            <span className="view-details">View Details →</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order Details</h3>
                            <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="modal-section">
                                <h4>Order Information</h4>
                                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                                <p><strong>Date:</strong> {formatDate(selectedOrder.date)}</p>
                                <p><strong>Status:</strong> {selectedOrder.status || 'N/A'}</p>
                            </div>

                            <div className="modal-section">
                                <h4>Restaurant</h4>
                                <p><strong>{selectedOrder.restaurantId?.name || 'N/A'}</strong></p>
                                <p>{formatAddress(selectedOrder.restaurantId?.address)}</p>
                            </div>

                            <div className="modal-section">
                                <h4>Customer</h4>
                                <p><strong>{selectedOrder.userId?.firstName || ''} {selectedOrder.userId?.lastName || ''}</strong></p>
                                <p>{formatAddress(selectedOrder.address)}</p>
                            </div>

                            <div className="modal-section">
                                <h4>Order Items</h4>
                                {selectedOrder.items?.length > 0 ? (
                                    <ul className="items-list">
                                        {selectedOrder.items.map((item, index) => (
                                            <li key={index}>{item.quantity}x {item.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No items listed</p>
                                )}
                            </div>

                            <div className="modal-section payment-section">
                                <div className="payment-row">
                                    <span>Order Total:</span>
                                    <strong>₹{(selectedOrder.amount || 0).toFixed(2)}</strong>
                                </div>
                                <div className="payment-row earnings-row">
                                    <span>Your Earnings (15%):</span>
                                    <strong>₹{calculateEarnings(selectedOrder.amount)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;