import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP State
  const [showOtpUI, setShowOtpUI] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempUserId, setTempUserId] = useState(null);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must contain only numbers');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/verify-otp`, {
        userId: tempUserId,
        otp: otp
      });

      if (response.data.success) {
        if (response.data.role !== 'admin') {
          setError(`Access denied. Admin privileges required. Your role is: ${response.data.role}`);
          toast.error(`Access denied. Admin privileges required. Your role is: ${response.data.role}`);
          setShowOtpUI(false);
          setOtp('');
          setTempUserId(null);
          return;
        }

        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        toast.success('Login successful!');
        onLoginSuccess();
      } else {
        setError(response.data.message || 'OTP verification failed');
        toast.error(response.data.message || 'OTP verification failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP verification failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`,
        {
          email: email.trim().toLowerCase(),
          password,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Check if MFA/OTP is required
        if (response.data.mfaRequired) {
          setTempUserId(response.data.userId);
          setShowOtpUI(true);
          toast.info('OTP sent to your email!');
          setLoading(false);
          return;
        }

        // Direct login (no MFA)
        if (response.data.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
          toast.error('Access denied. Admin privileges required.');
          return;
        }

        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        toast.success('Login successful!');
        onLoginSuccess();
      } else {
        setError(response.data.message || 'Login failed');
        toast.error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{showOtpUI ? 'Enter OTP' : 'Admin Login'}</h2>

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
              Please enter the 6-digit code sent to {email}
            </p>
            <div className="input-group">
              <label htmlFor="otp">OTP Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
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
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;