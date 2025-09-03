import React, { useContext, useEffect, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
    
    const { url, setToken, setUserName } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone_number: "",
        role: "customer"
    });
    const [error, setError] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        setError("");

        let endpoint = '';
        let payload = {};
        if (currState === 'Login') {
            endpoint = '/api/users/login';
            payload = {
                email: data.email,
                password: data.password
            };
        } else {
            endpoint = '/api/users/register';
            payload = data; 
        }
        
        const fullUrl = url + endpoint;

        try {
            const response = await axios.post(fullUrl, payload);

            if (response.data.token) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);

                if (response.data.name) {
                    setUserName(response.data.name);
                    localStorage.setItem("userName", response.data.name);
                }

                const userRole = response.data.role;
                if (userRole === 'restaurant_owner') {
                    window.location.href = 'https://partner.snap-dish.com'; 
                } else if (userRole === 'delivery_agent') {
            
                    window.location.href = 'https://snap-dish-2p9s.vercel.app/login'; 
                } else {
            
                    setShowLogin(false);
                }

            } else {
                 setError(response.data.message || "An unexpected error occurred.");
            }

        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="login-popup-inputs">
                    {error && <p className="error-message">{error}</p>}
                    {currState === "Sign Up" && (
                        <>
                          
                            <label htmlFor="role-select">I am a:</label>
                            <select id="role-select" name="role" value={data.role} onChange={onChangeHandler} required>
                                <option value="customer">Customer</option>
                                <option value="restaurant_owner">Restaurant Partner</option>
                                <option value="delivery_agent">Delivery Partner</option>
                            </select>

                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                            <input name='phone_number' onChange={onChangeHandler} value={data.phone_number} type="tel" placeholder='Phone number' required />
                        </>
                    )}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>{currState === "Login" ? "Login" : "Create account"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => { setCurrState('Sign Up'); setError(""); }}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => { setCurrState('Login'); setError(""); }}>Login here</span></p>
                }
            </form>
        </div>
    );
}

export default LoginPopup;