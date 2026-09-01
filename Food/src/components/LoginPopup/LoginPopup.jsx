import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext.jsx';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, setUserName, setUserRole } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone_number: "",
    role: "customer"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSuccess = (resData) => {
    const token = resData.token || resData.user?.token;
    const userRole = resData.role || resData.user?.role || "customer";

    // Block restaurant owners and delivery agents - they must use their own portals
    if (userRole === 'restaurant_owner') {
      toast.error("Restaurant owners must login at the Restaurant Admin portal.");
      setError("This portal is for customers only. Please use the Restaurant Admin portal to login.");
      return;
    }

    if (userRole === 'delivery_agent') {
      toast.error("Delivery agents must login at the Delivery Partner portal.");
      setError("This portal is for customers only. Please use the Delivery Partner portal to login.");
      return;
    }

    if (token) {
      setToken(token);
      localStorage.setItem("token", token);
    }

    const name = resData.firstName || resData.user?.firstName || "User";
    setUserName(name);
    localStorage.setItem("userName", name);

    setUserRole(userRole);
    localStorage.setItem("role", userRole);

    toast.success("Login successful!");
    setShowLogin(false);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return { hasMinLength, hasUpperCase, hasLowerCase, hasNumber, isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber };
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    const phoneRegex = /^[\d\s\-+()]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (currState === "Login") {
      if (!data.email || !data.email.trim()) { setError("Email is required"); return; }
      if (!validateEmail(data.email.trim())) { setError("Please enter a valid email address"); return; }
      if (!data.password) { setError("Password is required"); return; }
      if (data.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    } else {
      if (!data.firstName || !data.firstName.trim()) { setError("First name is required"); return; }
      if (data.firstName.trim().length < 2) { setError("First name must be at least 2 characters"); return; }
      if (!data.email || !data.email.trim()) { setError("Email is required"); return; }
      if (!validateEmail(data.email.trim())) { setError("Please enter a valid email address"); return; }
      if (!data.password) { setError("Password is required"); return; }
      const passwordCheck = validatePassword(data.password);
      if (!passwordCheck.hasMinLength) { setError("Password must be at least 8 characters"); return; }
      if (!passwordCheck.hasUpperCase) { setError("Password must contain at least one uppercase letter"); return; }
      if (!passwordCheck.hasLowerCase) { setError("Password must contain at least one lowercase letter"); return; }
      if (!passwordCheck.hasNumber) { setError("Password must contain at least one number"); return; }
      if (data.phone_number && !validatePhone(data.phone_number)) { setError("Please enter a valid phone number"); return; }
    }

    setIsLoading(true);

    const endpoint = currState === 'Login' ? '/api/users/login' : '/api/users/register';
    const payload = currState === 'Login'
      ? { email: data.email.trim(), password: data.password }
      : {
        firstName: data.firstName.trim(),
        lastName: data.lastName?.trim() || "",
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phone_number: data.phone_number || "",
        role: data.role || "customer"
      };

    try {
      const response = await axios.post(`${url}${endpoint}`, payload);

      if (response.data.success) {
        handleLoginSuccess(response.data);
      } else {
        setError(response.data.message || "Something went wrong");
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.response?.data?.message || "Connection failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <AnimatePresence>
      <motion.div className='login-popup' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.form
          onSubmit={onLogin}
          className="login-popup-container"
          initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        >
          <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" style={{ cursor: 'pointer' }} />
          </div>

          <div className="login-popup-inputs">
            {error && <p className="error-message">{error}</p>}

            {currState === "Login" ? (
              <>
                <input name='email' type="email" value={data.email} onChange={onChangeHandler} placeholder='Your email' required />
                <input name='password' type="password" value={data.password} onChange={onChangeHandler} placeholder='Password' required />
              </>
            ) : (
              <>
                <select name="role" value={data.role} onChange={onChangeHandler} className="role-select">
                  <option value="customer">Customer</option>
                  <option value="restaurant_owner">Restaurant Partner</option>
                  <option value="delivery_agent">Delivery Partner</option>
                </select>
                <input name='firstName' type="text" value={data.firstName} onChange={onChangeHandler} placeholder='First Name' required />
                <input name='lastName' type="text" value={data.lastName} onChange={onChangeHandler} placeholder='Last Name' />
                <input name='phone_number' type="tel" value={data.phone_number} onChange={onChangeHandler} placeholder='Phone' />
                <input name='email' type="email" value={data.email} onChange={onChangeHandler} placeholder='Your email' required />
                <input name='password' type="password" value={data.password} onChange={onChangeHandler} placeholder='Password (min 8 chars)' required />
              </>
            )}
          </div>

          <motion.button type='submit' disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {isLoading ? "Processing..." : (currState === "Login" ? "Login" : "Create account")}
          </motion.button>

          <>
            {currState === "Sign Up" && (
              <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>By continuing, I agree to the terms of use & privacy policy.</p>
              </div>
            )}
            {currState === "Login"
              ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
              : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
            }
          </>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginPopup;