import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the custom hook

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get auth state from context

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;