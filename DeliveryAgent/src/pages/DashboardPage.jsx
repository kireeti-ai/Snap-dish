import React, { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import OrderNotification from '../components/OrderNotification';
import ActiveOrder from '../components/ActiveOrder';

const DashboardPage = () => {
    const { isOnline, toggleOnlineStatus, availableOrders, activeOrder } = useContext(OrderContext);

    // We'll just show the first available order as a notification
    const newOrderToShow = availableOrders.length > 0 ? availableOrders[0] : null;

    return (
        <div>
            <div className="card status-toggle-card">
                <span>Your Status</span>
                <button onClick={toggleOnlineStatus} className={isOnline ? 'online-btn' : 'offline-btn'}>
                    {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
            </div>
            
            {/* Show notification only if we're online and not busy */}
            {isOnline && !activeOrder && <OrderNotification order={newOrderToShow} />}
            
            {/* Show active order if we have one */}
            <ActiveOrder />

            {/* Default messages */}
            {!activeOrder && !newOrderToShow && (
                <div className="card info-card">
                    {isOnline ? "You are online. Waiting for available orders..." : "You are offline."}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;