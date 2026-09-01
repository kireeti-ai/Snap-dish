import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './LoginPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const LoginPage = () => {
    const { login, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setError('');

        // Validation
        if (!formData.email || !formData.email.trim()) {
            setError('Email is required');
            setIsSubmitting(false);
            return;
        }

        if (!validateEmail(formData.email.trim())) {
            setError('Please enter a valid email address');
            setIsSubmitting(false);
            return;
        }

        if (!formData.password) {
            setError('Password is required');
            setIsSubmitting(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            if (response.data.success) {
                if (response.data.role !== 'delivery_agent' && response.data.role !== 'admin') {
                    const roleMessage = `Access denied. This portal is for delivery agents only. Your account role is: ${response.data.role}`;
                    setError(roleMessage);
                    toast.error(roleMessage);
                    setIsSubmitting(false);
                    return;
                }

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                toast.success(`Welcome, ${response.data.firstName}!`);

                setTimeout(() => {
                    navigate('/', { replace: true });
                    window.location.reload();
                }, 100);
            } else {
                setError(response.data.message || 'Login failed');
                toast.error(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error("Login failed:", err);
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h1>SnapDish Partner</h1>
                <h2>Delivery Partner Login</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#fff5f5',
                        color: '#e53e3e',
                        border: '1px solid #fc8181',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="sr-only">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;