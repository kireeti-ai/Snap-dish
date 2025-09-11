import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
    const { login } = useContext(AuthContext);

    const handleLogin = (e) => {
        e.preventDefault();

        console.log("Simulating successful login...");
        login();
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h1>snap-dish</h1>
                <p>Partner Portal</p>
                <h2>Partner Login</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <input type="email" placeholder="email@example.com"  required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};
export default LoginPage;