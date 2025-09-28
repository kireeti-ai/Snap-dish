import React, { useContext } from 'react';
// REMOVE BrowserRouter from this import
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EarningsPage from './pages/EarningsPage';
import ProfilePage from './pages/ProfilePage';

// This component remains the same
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    return isLoggedIn ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <OrderProvider>
                            <Routes>
                                <Route element={<Layout />}>
                                    <Route path="/" element={<DashboardPage />} />
                                    <Route path="/earnings" element={<EarningsPage />} />
                                    <Route path="/profile" element={<ProfilePage />} />
                                </Route>
                            </Routes>
                        </OrderProvider>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <div className="app-container">
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </div>
    );
}

export default App;