import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user was already logged in
        const storedLoginStatus = localStorage.getItem('agentLoggedIn') === 'true';
        if (storedLoginStatus) {
            setIsLoggedIn(true);
        }
    }, []);

    const login = () => {
        localStorage.setItem('agentLoggedIn', 'true');
        setIsLoggedIn(true);
        navigate('/'); // Navigate to dashboard after login
    };

    const logout = () => {
        localStorage.removeItem('agentLoggedIn');
        setIsLoggedIn(false);
        navigate('/login'); // Navigate to login after logout
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};