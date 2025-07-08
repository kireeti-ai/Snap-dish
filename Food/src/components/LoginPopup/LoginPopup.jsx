
import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setShowLogin }) => {
    const [cur, setCur] = useState("Login"); // State to manage 'Login' or 'Sign Up' view

    return (
        <div className='login-popup'>
            <form action="" className="login-popup-box">
                <div className="title">
                    <h2>{cur}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>

                <div className="inputs">
                    
                    {cur === "Sign Up" && <input type="text" placeholder='Your Full Name' required />}
                    <input type="email" placeholder='Your Email' required />
                    <input type="password" placeholder='Password' required /> 
                </div>
                         <div className="login-popup-condition">
                    <input type='checkbox' required/>
                    <p>I agree to the Terms & Conditions.</p>
                </div>

                <button type="submit"> {cur === "Sign Up" ? "Create Account" : "Log in"}</button>

       

                {cur === "Login" ? 
                    <p>Create a New Account? <span onClick={() => setCur("Sign Up")}>Click here</span></p> 
                    : 
                    <p>Already have an Account? <span onClick={() => setCur("Login")}>Log in now</span></p> 
                }
            </form>
        </div>
    );
};

export default LoginPopup;