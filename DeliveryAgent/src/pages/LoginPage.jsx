import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './LoginPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://snap-dish.onrender.com";

const LoginPage = () => {
    const { login, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // OTP State
    const [showOtpUI, setShowOtpUI] = useState(false);
    const [otp, setOtp] = useState('');
    const [tempUserId, setTempUserId] = useState(null);

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

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/verify-otp`, {
                userId: tempUserId,
                otp: otp
            });

            if (response.data.success) {
                // Check role
                if (response.data.role !== 'delivery_agent') {
                    setError('Access denied. This portal is for delivery agents only.');
                    toast.error('Access denied. This portal is for delivery agents only.');
                    setShowOtpUI(false);
                    setOtp('');
                    return;
                }

                // Store credentials
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                toast.success(`Welcome, ${response.data.firstName}!`);

                setTimeout(() => {
                    navigate('/', { replace: true });
                    window.location.reload();
                }, 100);
            } else {
                setError(response.data.message || 'OTP verification failed');
                toast.error(response.data.message || 'OTP verification failed');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'OTP verification failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setError('');

        // Validation
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            setIsSubmitting(false);
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            if (response.data.success) {
                // Check if MFA/OTP is required
                if (response.data.mfaRequired) {
                    setTempUserId(response.data.userId);
                    setShowOtpUI(true);
                    toast.info('OTP sent to your email!');
                    setIsSubmitting(false);
                    return;
                }

                // Direct login (no MFA) - shouldn't happen with current backend
                const success = await login(formData.email, formData.password);
                if (success) {
                    setTimeout(() => {
                        navigate('/', { replace: true });
                    }, 100);
                }
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
                <h2>{showOtpUI ? 'Enter OTP' : 'Delivery Partner Login'}</h2>

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

                {showOtpUI ? (
                    <form onSubmit={handleVerifyOTP} className="login-form">
                        <p style={{ textAlign: 'center', marginBottom: '15px', color: '#666' }}>
                            Please enter the 6-digit code sent to {formData.email}
                        </p>
                        <div className="form-group">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <p
                            style={{ marginTop: '15px', cursor: 'pointer', color: 'tomato', textAlign: 'center' }}
                            onClick={() => { setShowOtpUI(false); setOtp(''); setError(''); }}
                        >
                            Back to Login
                        </p>
                    </form>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default LoginPage;