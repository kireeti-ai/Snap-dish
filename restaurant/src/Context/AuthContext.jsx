import React, { createContext, useState, useContext } from 'react';
import { authService as mockAuthService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockAuthService.getCurrentUser());

  const login = async (username, password) => {
    const success = await mockAuthService.login(username, password);
    if (success) {
      setUser(mockAuthService.getCurrentUser());
    }
    return success;
  };

  const logout = () => {
    mockAuthService.logout();
    setUser(null);
  };

  const value = { user, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
  return useContext(AuthContext);
};