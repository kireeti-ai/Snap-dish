// import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
// import axios from 'axios';
// import { toast } from 'react-toastify';

// // Create the context
// export const AuthContext = createContext(null);
// //https://snap-dish.onrender.com"
// // Define the backend API URL
// const API_BASE_URL ="https://snap-dish.onrender.com";

// // --- Axios Helper ---
// const setAuthHeader = (token) => {
//     console.log("Setting auth header with token:", token ? "Token exists" : "No token");
//     if (token) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//         delete axios.defaults.headers.common['Authorization'];
//     }
// };

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(() => {
//         const savedToken = localStorage.getItem("token");
//         console.log("Initial token from localStorage:", savedToken ? "Token exists" : "No token");
//         return savedToken;
//     });
//     const [loading, setLoading] = useState(true);

//     // --- Session Verification Effect ---
//     useEffect(() => {
//         const verifyUserSession = async () => {
//             console.log("Starting session verification...");
//             if (!token) {
//                 console.log("No token found, skipping verification");
//                 setLoading(false);
//                 return;
//             }

//             setAuthHeader(token);

//             try {
//                 console.log("Verifying session with backend...");
//                 const response = await axios.get(`${API_BASE_URL}/api/users/profile`);
//                 console.log("Session verification response:", response.data);
                
//                 if (response.data.success) {
//                     console.log("Session valid, setting user:", response.data.user);
//                     setUser(response.data.user);
//                 } else {
//                     console.log("Session verification failed:", response.data);
//                 }
//             } catch (error) {
//                 console.error("Session verification error:", error);
//                 console.log("Clearing invalid session data");
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("user");
//                 setToken(null);
//                 setUser(null);
//                 setAuthHeader(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         verifyUserSession();
//     }, [token]);

//     // --- Login Function ---
//     const login = useCallback(async (email, password) => {
//         console.log("=== LOGIN ATTEMPT STARTED ===");
//         console.log("Email:", email);
//         console.log("API URL:", `${API_BASE_URL}/api/users/login`);
        
//         try {
//             console.log("Sending login request...");
//             const response = await axios.post(`${API_BASE_URL}/api/users/login`, { 
//                 email, 
//                 password 
//             });
            
//             console.log("Login response received:", response.data);
            
//             if (response.data.success) {
//                 const { token: receivedToken, user: receivedUser } = response.data;
//                 console.log("Login successful!");
//                 console.log("Received user:", receivedUser);
//                 console.log("User role:", receivedUser.role);

//                 // CRITICAL: Role check
//                 if (receivedUser.role !== 'delivery_agent') {
//                     console.warn("Role check failed. Expected: 'delivery_agent', Got:", receivedUser.role);
//                     toast.error("Access denied. This portal is for delivery agents only.");
//                     return;
//                 }

//                 console.log("Role check passed, storing credentials...");
                
//                 // Store data in localStorage
//                 localStorage.setItem("token", receivedToken);
//                 localStorage.setItem("user", JSON.stringify(receivedUser));
//                 console.log("Credentials stored in localStorage");

//                 // Update state and Axios header
//                 setToken(receivedToken);
//                 setUser(receivedUser);
//                 setAuthHeader(receivedToken);
//                 console.log("State updated, login complete!");

//                 toast.success(`Welcome back, ${receivedUser.firstName}!`);
//             } else {
//                 console.error("Login failed - success=false:", response.data.message);
//                 toast.error(response.data.message || "An unknown error occurred.");
//             }
//         } catch (error) {
//             console.error("=== LOGIN ERROR ===");
//             console.error("Error object:", error);
//             console.error("Error response:", error.response?.data);
//             console.error("Error status:", error.response?.status);
            
//             if (error.response?.status === 404) {
//                 toast.error("Backend server not found. Please ensure the server is running on http://localhost:4000");
//             } else if (error.response?.data?.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error("Login failed. Please check your credentials and try again.");
//             }
//         }
//         console.log("=== LOGIN ATTEMPT ENDED ===");
//     }, []);

//     // --- Logout Function ---
//     const logout = useCallback(() => {
//         console.log("Logging out...");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setToken(null);
//         setUser(null);
//         setAuthHeader(null);
//         toast.info("You have been logged out.");
//     }, []);

//     // --- Memoized Context Value ---
//     const contextValue = useMemo(() => ({
//         user,
//         token,
//         isLoggedIn: !!token,
//         loading,
//         login,
//         logout
//     }), [user, token, loading, login, logout]);

//     console.log("AuthProvider render - isLoggedIn:", !!token, "loading:", loading);

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };
import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

// Create the context
export const AuthContext = createContext(null);

// Define the backend API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// --- Axios Helper ---
const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem("token");
        return savedToken;
    });
    const [loading, setLoading] = useState(true);

    // --- Session Verification Effect ---
    useEffect(() => {
        const verifyUserSession = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            setAuthHeader(token);

            try {
                const response = await axios.get(`${API_BASE_URL}/api/users/profile`);
                
                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Session verification error:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setToken(null);
                setUser(null);
                setAuthHeader(null);
            } finally {
                setLoading(false);
            }
        };

        verifyUserSession();
    }, [token]);

    // --- Login Function ---
    const login = useCallback(async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/login`, { 
                email, 
                password 
            });
            
            if (response.data.success) {
                const { token: receivedToken, user: receivedUser } = response.data;

                // CRITICAL: Role check
                if (receivedUser.role !== 'delivery_agent') {
                    toast.error("Access denied. This portal is for delivery agents only.");
                    return;
                }
                
                // Store data in localStorage
                localStorage.setItem("token", receivedToken);
                localStorage.setItem("user", JSON.stringify(receivedUser));

                // Update state and Axios header
                setToken(receivedToken);
                setUser(receivedUser);
                setAuthHeader(receivedToken);

                toast.success(`Welcome back, ${receivedUser.firstName}!`);
            } else {
                toast.error(response.data.message || "An unknown error occurred.");
            }
        } catch (error) {
            console.error("Login error:", error);
            
            if (error.response?.status === 404) {
                toast.error("Backend server not found. Please ensure the server is running.");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Login failed. Please check your credentials and try again.");
            }
        }
    }, []);

    // --- Update User Function ---
    const updateUser = useCallback((updatedUserData) => {
        setUser(prev => ({ ...prev, ...updatedUserData }));
        localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUserData }));
    }, [user]);

    // --- Logout Function ---
    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setAuthHeader(null);
        toast.info("You have been logged out.");
    }, []);

    // --- Memoized Context Value ---
    const contextValue = useMemo(() => ({
        user,
        token,
        isLoggedIn: !!token,
        loading,
        login,
        logout,
        updateUser,
        API_BASE_URL
    }), [user, token, loading, login, logout, updateUser]);

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};