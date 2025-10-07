import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css'; // Assuming you have a corresponding CSS file



const LoginPage = () => {
    // The login function and loading state are now destructured from AuthContext.
    // Note: The 'loading' from AuthContext is for the initial session check.
    // We will use a local 'isSubmitting' for the login button action itself.
    const { login } = useContext(AuthContext);

    // Unified state for form data for easier management
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Local state to manage the submission status of the form
    const [isSubmitting, setIsSubmitting] = useState(false);

    // A single handler to update the form data state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    // Handles the form submission asynchronously
const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked. Attempting to log in with:", formData.email); // <-- ADD THIS LINE

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
        await login(formData.email, formData.password);
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
                            name="email" // 'name' attribute is crucial for the generic handler
                            placeholder="email@example.com" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            disabled={isSubmitting} // Disable input during submission
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"  className="sr-only">Password</label>
                        <input 
                            id="password"
                            type="password"
                            name="password" // 'name' attribute is crucial for the generic handler
                            placeholder="Password" 
                            value={formData.password}
                            onChange={handleChange}
                            required 
                            disabled={isSubmitting} // Disable input during submission
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