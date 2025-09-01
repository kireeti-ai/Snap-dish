import React, { createContext, useState, useEffect } from 'react';

// Mock Data for a new order
const mockNewOrder = {
  id: 'ORD-98765',
  restaurant: 'Amrita Cafe, Ettimadai',
  customer: 'K. Anand, Academic Block 2',
  earnings: '₹60',
};

export const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(false);
    const [newOrder, setNewOrder] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);

    // Effect to simulate receiving a new order when online
    useEffect(() => {
        let timer;
        if (isOnline && !newOrder && !activeOrder) {
            console.log("Online and waiting for orders...");
            timer = setTimeout(() => {
                console.log("New order received!");
                setNewOrder(mockNewOrder);
            }, 5000); // New order appears after 5 seconds
        }
        return () => clearTimeout(timer); // Cleanup timer
    }, [isOnline, newOrder, activeOrder]);

    const toggleOnlineStatus = () => setIsOnline(prev => !prev);

    const acceptOrder = () => {
        setActiveOrder({ ...newOrder, status: 'Accepted' });
        setNewOrder(null);
    };

    const rejectOrder = () => {
        setNewOrder(null);
        console.log("Order rejected. Waiting for new orders.");
    };

    const updateOrderStatus = (status) => {
        setActiveOrder((prev) => ({ ...prev, status }));
        if (status === 'Delivered') {
            // After 2 seconds, clear the delivered order to return to the default dashboard
            setTimeout(() => {
                setActiveOrder(null);
            }, 2000);
        }
    };

    const value = {
        isOnline,
        toggleOnlineStatus,
        newOrder,
        activeOrder,
        acceptOrder,
        rejectOrder,
        updateOrderStatus,
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};