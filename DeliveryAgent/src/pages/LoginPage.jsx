import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
    const { login, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    const handleLogin = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const success = await login(formData.email, formData.password);
            
            // If login successful, navigate to dashboard
            if (success) {
                // Small delay to ensure state updates propagate
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 100);
            }
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h1>SnapDish Partner</h1>
                <h2>Partner Login</h2>
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