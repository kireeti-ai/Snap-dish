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
        phone_number: ""
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

        let endpoint = currState === 'Login' ? '/api/users/login' : '/api/users/register';
        const fullUrl = url + endpoint;

        try {
            const response = await axios.post(fullUrl, data);

            // If the request succeeds, the code will get here.
            // The data we need is directly in response.data
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);

            // Use the name from the response if available
            if (response.data.name) {
                setUserName(response.data.name);
                localStorage.setItem("userName", response.data.name);
            }

            setShowLogin(false);

        } catch (error) {
            // Axios places the server's error response in error.response.data
            setError(error.response?.data?.message || "An unexpected error occurred.");
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
