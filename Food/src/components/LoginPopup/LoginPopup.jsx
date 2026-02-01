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
    if (token) {
      setToken(token);
      localStorage.setItem("token", token);
    }

    const name = resData.firstName || resData.user?.firstName || "User";
    setUserName(name);
    localStorage.setItem("userName", name);

    const userRole = resData.role || resData.user?.role || "customer";
    setUserRole(userRole);
    localStorage.setItem("role", userRole);

    toast.success("Login successful!");

    if (userRole === 'restaurant_owner') {
      navigate('/restaurant-dashboard');
    } else if (userRole === 'delivery_agent') {
      navigate('/delivery-dashboard');
    } else {
      setShowLogin(false);
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (currState === "Login") {
      // Login Validation
      if (!data.email || !data.password) {
        setError("Please enter both email and password");
        setIsLoading(false);
        return;
      }
    } else {
      // Registration Validation
      if (!data.firstName || !data.firstName.trim()) {
        setError("First name is required");
        setIsLoading(false);
        return;
      }
      if (!data.email) {
        setError("Email is required");
        setIsLoading(false);
        return;
      }
      if (!data.password) {
        setError("Password is required");
        setIsLoading(false);
        return;
      }
      if (data.password.length < 8) {
        setError("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }
    }

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
                  onChange={(e) => setOtp(e.target.value)}

                  maxLength={6}
                  style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
                  required
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