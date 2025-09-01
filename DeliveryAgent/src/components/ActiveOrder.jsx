import React, { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import './ActiveOrder.css';

const ActiveOrder = () => {
    const { activeOrder, updateOrderStatus } = useContext(OrderContext);

    if (!activeOrder) return null;

    const getNextStatus = () => {
        switch (activeOrder.status) {
            case 'Accepted': return 'Reached Restaurant';
            case 'Reached Restaurant': return 'Picked Up';
            case 'Picked Up': return 'Delivered';
            default: return '';
        }
    };
    
    const isFinalStep = activeOrder.status === 'Delivered';

    return (
        <div className="card active-order-card">
            <h3>Active Order: {activeOrder.id}</h3>
            <p className="status">Status: <strong>{activeOrder.status}</strong></p>
            <p><strong>Pickup:</strong> {activeOrder.restaurant}</p>
            <p><strong>Dropoff:</strong> {activeOrder.customer}</p>
            {!isFinalStep ? (
                <button onClick={() => updateOrderStatus(getNextStatus())} className="btn btn-primary">
                    Mark as "{getNextStatus()}"
                </button>
            ) : (
                <p className="completed-message">Order Delivered! Well done.</p>
            )}
        </div>
    );
};
export default ActiveOrder;