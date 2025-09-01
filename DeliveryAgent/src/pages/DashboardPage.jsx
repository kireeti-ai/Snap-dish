import React, { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import OrderNotification from '../components/OrderNotification';
import ActiveOrder from '../components/ActiveOrder';
import './DashboardPage.css';

const DashboardPage = () => {
    const { isOnline, toggleOnlineStatus, newOrder, activeOrder } = useContext(OrderContext);

    return (
        <div>
            <div className="card status-toggle-card">
                <span>Your Status</span>
                <button onClick={toggleOnlineStatus} className={isOnline ? 'online-btn' : 'offline-btn'}>
                    {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
            </div>
            
            {/* Show Order Components based on state */}
            <OrderNotification />
            <ActiveOrder />

            {/* Show a default message if no orders are active */}
            {!newOrder && !activeOrder && (
                <div className="card info-card">
                    {isOnline ? "You are online and ready to receive orders." : "You are offline. Go online to start working."}
                </div>
            )}
        </div>
    );
};
export default DashboardPage;