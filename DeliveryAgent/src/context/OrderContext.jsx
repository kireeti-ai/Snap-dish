// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { AuthContext } from './AuthContext';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { toast } from 'react-toastify';

// export const OrderContext = createContext(null);
// const API_BASE_URL = "https://snap-dish.onrender.com";

// export const OrderProvider = ({ children }) => {
//     const { token } = useContext(AuthContext);
//     const [socket, setSocket] = useState(null);
//     const [isOnline, setIsOnline] = useState(false);
//     const [availableOrders, setAvailableOrders] = useState([]);
//     const [activeOrder, setActiveOrder] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // Configure axios with token
//     useEffect(() => {
//         if (token) {
//             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         }
//     }, [token]);

//     // --- WebSocket Connection ---
//     useEffect(() => {
//         if (token) {
//             const newSocket = io(API_BASE_URL, {
//                 transports: ['websocket', 'polling'],
//                 reconnection: true,
//                 reconnectionDelay: 1000,
//                 reconnectionAttempts: 5
//             });

//             newSocket.on('connect', () => {
//                 console.log('Socket connected:', newSocket.id);
//                 // Automatically join delivery agents room if online
//                 if (isOnline) {
//                     newSocket.emit('agentOnline');
//                 }
//             });

//             newSocket.on('disconnect', () => {
//                 console.log('Socket disconnected');
//             });

//             // Listen for real-time updates on our active order
//             newSocket.on('orderStatusUpdated', (updatedOrder) => {
//                 console.log('Order status updated:', updatedOrder);
//                 setActiveOrder(prev => {
//                     if (prev && prev._id === updatedOrder._id) {
//                         return updatedOrder;
//                     }
//                     return prev;
//                 });
//             });

//             // Listen for new delivery opportunities broadcast to all agents
//             newSocket.on('newDeliveryAvailable', (newOrder) => {
//                 console.log('New delivery available:', newOrder);
//                 setAvailableOrders(prev => {
//                     // Check if order already exists
//                     const exists = prev.some(o => o._id === newOrder._id);
//                     if (!exists) {
//                         toast.info("New delivery available!");
//                         return [newOrder, ...prev];
//                     }
//                     return prev;
//                 });
//             });

//             newSocket.on('connect_error', (error) => {
//                 console.error('Socket connection error:', error);
//             });

//             setSocket(newSocket);

//             return () => {
//                 console.log('Cleaning up socket connection');
//                 newSocket.close();
//             };
//         }
//     }, [token]); // Removed isOnline from dependencies
    
//     // --- Fetch Initial Data ---
//     const fetchInitialData = async () => {
//         if (!token) return;
        
//         setLoading(true);
//         try {
//             // Check for an already active order on app load
//             const activeOrderRes = await axios.get(
//                 `${API_BASE_URL}/api/delivery/active-order`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
            
//             if (activeOrderRes.data.success && activeOrderRes.data.data) {
//                 setActiveOrder(activeOrderRes.data.data);
//                 // Join the order room for real-time updates
//                 if (socket) {
//                     socket.emit('joinOrderRoom', activeOrderRes.data.data._id);
//                 }
//             } else {
//                 // If no active order, fetch available orders
//                 const availableOrdersRes = await axios.get(
//                     `${API_BASE_URL}/api/delivery/available-orders`,
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//                 if (availableOrdersRes.data.success) {
//                     setAvailableOrders(availableOrdersRes.data.data);
//                 }
//             }
//         } catch (error) {
//             console.error("Error fetching initial data:", error);
//             if (error.response?.status === 401) {
//                 toast.error("Session expired. Please login again.");
//             } else {
//                 toast.error("Failed to load orders");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     useEffect(() => {
//         if (token && socket) {
//             fetchInitialData();
//         }
//     }, [token, socket]);

//     // --- Agent Actions ---
//     const toggleOnlineStatus = () => {
//         if (!socket) {
//             toast.error("Not connected to server");
//             return;
//         }

//         const newStatus = !isOnline;
//         setIsOnline(newStatus);
        
//         if (newStatus) {
//             socket.emit('agentOnline');
//             toast.success("You are now online and will receive order notifications");
//             // Fetch available orders when going online
//             fetchInitialData();
//         } else {
//             toast.warn("You are now offline");
//         }
//     };

//     const acceptOrder = async (orderId) => {
//         if (!orderId) {
//             toast.error("Invalid order ID");
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await axios.post(
//                 `${API_BASE_URL}/api/delivery/accept-order`, 
//                 { orderId },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
            
//             if (response.data.success) {
//                 setActiveOrder(response.data.data);
//                 setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
                
//                 // Join the order room for real-time updates
//                 if (socket) {
//                     socket.emit('joinOrderRoom', orderId);
//                 }
                
//                 toast.success("Order accepted successfully!");
//             }
//         } catch (error) {
//             console.error("Accept order error:", error);
//             if (error.response?.data?.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error("Failed to accept order");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateOrderStatus = async (status) => {
//         if (!activeOrder) {
//             toast.error("No active order");
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await axios.post(
//                 `${API_BASE_URL}/api/delivery/update-status`, 
//                 { orderId: activeOrder._id, status },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
            
//             if (response.data.success) {
//                 toast.success(`Order status updated to: ${status}`);
                
//                 // If delivered, clear active order after delay
//                 if (status === 'Delivered') {
//                     setTimeout(() => {
//                         if (socket) {
//                             socket.emit('leaveOrderRoom', activeOrder._id);
//                         }
//                         setActiveOrder(null);
//                         fetchInitialData(); // Check for more available orders
//                         toast.success("Great job! Ready for next delivery.");
//                     }, 2000);
//                 }
//             }
//         } catch (error) {
//             console.error("Update status error:", error);
//             if (error.response?.data?.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error("Failed to update status");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const value = {
//         isOnline,
//         toggleOnlineStatus,
//         availableOrders,
//         activeOrder,
//         acceptOrder,
//         updateOrderStatus,
//         loading
//     };

//     return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
// };

import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

export const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
    const { token, API_BASE_URL } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    // Configure axios with token
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    // --- WebSocket Connection ---
    useEffect(() => {
        if (token && API_BASE_URL) {
            const newSocket = io(API_BASE_URL, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                if (isOnline) {
                    newSocket.emit('agentOnline');
                }
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            // Listen for real-time updates on our active order
            newSocket.on('orderStatusUpdated', (updatedOrder) => {
                console.log('Order status updated:', updatedOrder);
                setActiveOrder(prev => {
                    if (prev && prev._id === updatedOrder._id) {
                        return updatedOrder;
                    }
                    return prev;
                });
            });

            // Listen for new delivery opportunities broadcast to all agents
            newSocket.on('newDeliveryAvailable', (newOrder) => {
                console.log('New delivery available:', newOrder);
                setAvailableOrders(prev => {
                    const exists = prev.some(o => o._id === newOrder._id);
                    if (!exists) {
                        toast.info("New delivery available!");
                        return [newOrder, ...prev];
                    }
                    return prev;
                });
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            setSocket(newSocket);

            return () => {
                console.log('Cleaning up socket connection');
                newSocket.close();
            };
        }
    }, [token, API_BASE_URL]);
    
    // --- Fetch Initial Data ---
    const fetchInitialData = async () => {
        if (!token) return;
        
        setLoading(true);
        try {
            // Check for an already active order on app load
            const activeOrderRes = await axios.get(
                `${API_BASE_URL}/api/delivery/active-order`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (activeOrderRes.data.success && activeOrderRes.data.data) {
                setActiveOrder(activeOrderRes.data.data);
                if (socket) {
                    socket.emit('joinOrderRoom', activeOrderRes.data.data._id);
                }
            } else {
                // If no active order, fetch available orders
                const availableOrdersRes = await axios.get(
                    `${API_BASE_URL}/api/delivery/available-orders`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (availableOrdersRes.data.success) {
                    setAvailableOrders(availableOrdersRes.data.data);
                }
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            } else {
                toast.error("Failed to load orders");
            }
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (token && socket) {
            fetchInitialData();
        }
    }, [token, socket]);

    // --- Agent Actions ---
    const toggleOnlineStatus = () => {
        if (!socket) {
            toast.error("Not connected to server");
            return;
        }

        const newStatus = !isOnline;
        setIsOnline(newStatus);
        
        if (newStatus) {
            socket.emit('agentOnline');
            toast.success("You are now online and will receive order notifications");
            fetchInitialData();
        } else {
            toast.warn("You are now offline");
        }
    };

    const acceptOrder = async (orderId) => {
        if (!orderId) {
            toast.error("Invalid order ID");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/delivery/accept-order`, 
                { orderId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setActiveOrder(response.data.data);
                setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
                
                if (socket) {
                    socket.emit('joinOrderRoom', orderId);
                }
                
                toast.success("Order accepted successfully!");
            }
        } catch (error) {
            console.error("Accept order error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to accept order");
            }
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (status) => {
        if (!activeOrder) {
            toast.error("No active order");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/delivery/update-status`, 
                { orderId: activeOrder._id, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                toast.success(`Order status updated to: ${status}`);
                
                if (status === 'Delivered') {
                    setTimeout(() => {
                        if (socket) {
                            socket.emit('leaveOrderRoom', activeOrder._id);
                        }
                        setActiveOrder(null);
                        fetchInitialData();
                        toast.success("Great job! Ready for next delivery.");
                    }, 2000);
                }
            }
        } catch (error) {
            console.error("Update status error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to update status");
            }
        } finally {
            setLoading(false);
        }
    };

    const value = {
        isOnline,
        toggleOnlineStatus,
        availableOrders,
        activeOrder,
        acceptOrder,
        updateOrderStatus,
        loading
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};