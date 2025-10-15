import React, { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import './OrderNotification.css';

const OrderNotification = ({ order }) => {
    const { acceptOrder, loading } = useContext(OrderContext);

    if (!order) return null;

    const getRestaurantInfo = () => {
        if (order.restaurantId) {
            if (typeof order.restaurantId === 'object') {
                return {
                    name: order.restaurantId.name || 'Restaurant',
                    address: order.restaurantId.address || {}
                };
            }
        }
        return {
            name: 'Restaurant',
            address: {}
        };
    };


    const formatAddress = (address) => {
        if (typeof address === 'object' && address !== null) {
            return `${address.street || ''}, ${address.city || ''}`.trim() || 'Address not available';
        }
        return 'Address not available';
    };
    const getDeliveryAddress = () => {
        if (order.address) {
            return formatAddress(order.address);
        }
        return 'Address not available';
    };

    const estimatedEarnings = order.amount ? (order.amount * 0.15).toFixed(2) : '50.00';

    const restaurant = getRestaurantInfo();

    return (
        <div className="card new-order-card">
            <h3>🔔 New Order Available!</h3>
            
            <div className="order-info">
                <div className="info-row">
                    <span className="label">📍 Pickup:</span>
                    <span className="value">
                        <strong>{restaurant.name}</strong>
                        <br />
                        <small>{formatAddress(restaurant.address)}</small>
                    </span>
                </div>

                <div className="info-row">
                    <span className="label">🏠 Delivery:</span>
                    <span className="value">
                        <small>{getDeliveryAddress()}</small>
                    </span>
                </div>

                <div className="info-row">
                    <span className="label">💵 Est. Earnings:</span>
                    <span className="value earnings">₹{estimatedEarnings}</span>
                </div>

                {order.items && order.items.length > 0 && (
                    <div className="info-row">
                        <span className="label">📦 Items:</span>
                        <span className="value">{order.items.length} item(s)</span>
                    </div>
                )}
            </div>

            <div className="actions">
                <button 
                    onClick={() => acceptOrder(order._id)} 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Accepting...' : 'Accept Order'}
                </button>
            </div>
        </div>
    );
};

export default OrderNotification;