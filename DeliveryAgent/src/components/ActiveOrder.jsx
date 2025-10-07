import React, { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import './ActiveOrder.css';

// Helper to format an address object into a string
const formatAddress = (addr) => {
    if (!addr || typeof addr !== 'object') {
        return 'Address not available';
    }
    // Filters out empty parts and joins them with a comma
    return [addr.street, addr.city, addr.state, addr.zip]
        .filter(part => part) // Remove any null or undefined parts
        .join(', ') || 'Address not available';
};


const ActiveOrder = () => {
    const { activeOrder, updateOrderStatus, loading } = useContext(OrderContext);

    if (!activeOrder) return null;

    const getNextStatus = () => {
        switch (activeOrder.status) {
            case 'Out for Delivery':
                return 'Reached Restaurant';
            case 'Reached Restaurant':
                return 'Picked Up';
            case 'Picked Up':
                return 'Delivered';
            default:
                return '';
        }
    };

    const isFinalStep = activeOrder.status === 'Delivered';
    const nextStatus = getNextStatus();

    // Safely get restaurant info using the new formatAddress helper
    const restaurant = {
        name: activeOrder.restaurantId?.name || 'Restaurant',
        address: formatAddress(activeOrder.restaurantId?.address),
    };

    // Safely get customer info
    const customer = {
        name: `${activeOrder.userId?.firstName || ''} ${activeOrder.userId?.lastName || ''}`.trim() || 'Customer',
        phone: activeOrder.userId?.phone_number || 'N/A',
    };

    const deliveryAddress = formatAddress(activeOrder.address);

    return (
        <div className="card active-order-card">
            <h3>Active Order: #{activeOrder._id?.slice(-6) || 'N/A'}</h3>
            
            <div className={`status status-${activeOrder.status.replace(/\s+/g, '-').toLowerCase()}`}>
                <strong>Status: {activeOrder.status}</strong>
            </div>

            <div className="order-details">
                <div className="detail-section">
                    <h4>📍 Pickup Location</h4>
                    <p><strong>{restaurant.name}</strong></p>
                    <p>{restaurant.address}</p>
                </div>

                <div className="detail-section">
                    <h4>🏠 Delivery Location</h4>
                    <p><strong>{customer.name}</strong></p>
                    <p>📞 {customer.phone}</p>
                    <p>{deliveryAddress}</p>
                </div>

                <div className="detail-section">
                    <h4>📦 Order Items</h4>
                    {activeOrder.items && activeOrder.items.length > 0 ? (
                        <ul className="items-list">
                            {activeOrder.items.map((item, index) => (
                                <li key={index}>
                                    {item.quantity}x {item.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No items listed</p>
                    )}
                </div>

                <div className="detail-section">
                    <h4>💰 Total Amount</h4>
                    <p className="amount">₹{activeOrder.amount?.toFixed(2) || '0.00'}</p>
                </div>
            </div>

            {!isFinalStep && nextStatus ? (
                <button
                    onClick={() => updateOrderStatus(nextStatus)}
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : `Mark as "${nextStatus}"`}
                </button>
            ) : isFinalStep ? (
                <p className="completed-message">✅ Order Delivered! Well done.</p>
            ) : null}
        </div>
    );
};

export default ActiveOrder;