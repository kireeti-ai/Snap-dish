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

  // --- STATE FOR MFA ---
  const [showOtpUI, setShowOtpUI] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUserId, setTempUserId] = useState(null);
  const [registrationId, setRegistrationId] = useState(null);
  const [isRegistration, setIsRegistration] = useState(false);
  // -------------------------

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


  const onVerifyOTP = async (event) => {
    event.preventDefault();
    setError("");

    // OTP Validation
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must contain only numbers");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${url}/api/users/verify-otp`, {
        userId: tempUserId,
        registrationId: registrationId,
        otp: otp
      });

      if (response.data.success) {
        toast.success(isRegistration ? "Account verified successfully!" : "Login successful!");
        handleLoginSuccess(response.data);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error('OTP Error:', err);
      const msg = err.response?.data?.message || "Invalid or expired OTP";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (resData) => {
    const token = resData.token || resData.user?.token;
    const userRole = resData.role || resData.user?.role || "customer";

    // Block restaurant owners and delivery agents - they must use their own portals
    if (userRole === 'restaurant_owner') {
      toast.error("Restaurant owners must login at the Restaurant Admin portal (localhost:5174)");
      setError("This portal is for customers only. Please use the Restaurant Admin portal to login.");
      return;
    }

    if (userRole === 'delivery_agent') {
      toast.error("Delivery agents must login at the Delivery Partner portal (localhost:5175)");
      setError("This portal is for customers only. Please use the Delivery Partner portal to login.");
      return;
    }

    // Only customers can login through Food app
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

<<<<<<< HEAD
    if (userRole === 'restaurant_owner') {
      // Redirect to external restaurant admin app
      const restaurantAdminUrl = process.env.NODE_ENV === 'production'
        ? 'https://snap-dish-d5y5.vercel.app'
        : 'http://localhost:5174';
      window.location.href = restaurantAdminUrl;
    } else if (userRole === 'delivery_agent') {
      // Redirect to external delivery agent app
      const deliveryAgentUrl = process.env.NODE_ENV === 'production'
        ? 'https://snap-dish-2p9s.vercel.app'
        : 'http://localhost:5175';
      window.location.href = deliveryAgentUrl;
    } else {
      setShowLogin(false);
    }
=======
  // Validation helpers
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return { hasMinLength, hasUpperCase, hasLowerCase, hasNumber, isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber };
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\d\s\-+()]{10,15}$/;
    return phoneRegex.test(phone);
>>>>>>> 0e518ca (dev local)
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (currState === "Login") {
      // Login Validation
      if (!data.email || !data.email.trim()) {
        setError("Email is required");
        return;
      }
      if (!validateEmail(data.email.trim())) {
        setError("Please enter a valid email address");
        return;
      }
      if (!data.password) {
        setError("Password is required");
        return;
      }
      if (data.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
    } else {
      // Registration Validation
      if (!data.firstName || !data.firstName.trim()) {
        setError("First name is required");
        return;
      }
      if (data.firstName.trim().length < 2) {
        setError("First name must be at least 2 characters");
        return;
      }
      if (!data.email || !data.email.trim()) {
        setError("Email is required");
        return;
      }
      if (!validateEmail(data.email.trim())) {
        setError("Please enter a valid email address");
        return;
      }
      if (!data.password) {
        setError("Password is required");
        return;
      }
      const passwordCheck = validatePassword(data.password);
      if (!passwordCheck.hasMinLength) {
        setError("Password must be at least 8 characters");
        return;
      }
      if (!passwordCheck.hasUpperCase) {
        setError("Password must contain at least one uppercase letter");
        return;
      }
      if (!passwordCheck.hasLowerCase) {
        setError("Password must contain at least one lowercase letter");
        return;
      }
      if (!passwordCheck.hasNumber) {
        setError("Password must contain at least one number");
        return;
      }
      if (data.phone_number && !validatePhone(data.phone_number)) {
        setError("Please enter a valid phone number");
        return;
      }
    }

    setIsLoading(true);

    const endpoint = currState === 'Login' ? '/api/users/login' : '/api/users/register';

    // For registration, we send the full data.
    // For login, we send email/password.
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
        // CHECK FOR MFA REQUIREMENT (both login and registration)
        if (response.data.mfaRequired) {
          if (response.data.isRegistration) {
            setRegistrationId(response.data.registrationId);
          } else {
            setTempUserId(response.data.userId);
          }
          setIsRegistration(response.data.isRegistration || false);
          setShowOtpUI(true);
          toast.info(response.data.isRegistration ? "Verify your email to complete registration!" : "OTP sent to your email!");
          setIsLoading(false);
          return;
        }

        // If regular login/register (no MFA or after register)
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
          onSubmit={showOtpUI ? onVerifyOTP : onLogin} // Switch handler based on state
          className="login-popup-container"
          initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        >
          <div className="login-popup-title">
            <h2>{showOtpUI ? (isRegistration ? "Verify Email" : "Enter OTP") : currState}</h2>
            <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" style={{ cursor: 'pointer' }} />
          </div>

          <div className="login-popup-inputs">
            {error && <p className="error-message">{error}</p>}

            {showOtpUI ? (
              // --- OTP UI ---
              <div style={{ textAlign: 'center' }}>
                <p>{isRegistration ? "Please verify your email with the 6-digit code sent to" : "Please enter the 6-digit code sent to"} {data.email}</p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
                  required
                  disabled={isLoading}
                />
              </div>
            ) : (
              // --- NORMAL LOGIN/REGISTER UI ---
              <>
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
              </>
            )}
          </div>

          <motion.button type='submit' disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {isLoading
              ? "Processing..."
              : (showOtpUI ? "Verify OTP" : (currState === "Login" ? "Login" : "Create account"))
            }
          </motion.button>

          {!showOtpUI && (
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
          )}

          {showOtpUI && (
            <p style={{ marginTop: '10px', cursor: 'pointer', color: 'tomato' }} onClick={() => setShowOtpUI(false)}>
              Back to Login
            </p>
          )}
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginPopup;