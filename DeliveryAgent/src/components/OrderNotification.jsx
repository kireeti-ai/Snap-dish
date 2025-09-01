import React, { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import './OrderNotification.css';

const OrderNotification = () => {
    const { newOrder, acceptOrder, rejectOrder } = useContext(OrderContext);

    if (!newOrder) return null;

    return (
        <div className="card new-order-card">
            <h3>New Order!</h3>
            <p><strong>From:</strong> {newOrder.restaurant}</p>
            <p><strong>To:</strong> {newOrder.customer}</p>
            <p className="earnings"><strong>Earnings: {newOrder.earnings}</strong></p>
            <div className="actions">
                <button onClick={rejectOrder} className="btn btn-secondary">Reject</button>
                <button onClick={acceptOrder} className="btn btn-primary">Accept</button>
            </div>
        </div>
    );
};
export default OrderNotification;