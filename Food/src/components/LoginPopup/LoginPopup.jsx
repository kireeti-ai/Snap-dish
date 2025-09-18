import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, setUserName } = useContext(StoreContext);
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

  const onLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!data.email || !data.password) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (currState === 'Sign Up') {
      if (!data.firstName) {
        setError("First name is required");
        setIsLoading(false);
        return;
      }
    }

    const endpoint = currState === 'Login' ? '/api/users/login' : '/api/users/register';
    const payload = currState === 'Login'
      ? { email: data.email, password: data.password }
      : data;

    try {
      const response = await axios.post(`${url}${endpoint}`, payload);
      console.log('Response:', response.data); // Debug log

      if (response.data.success && response.data.token) {
        // Save token
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        // Save user name - check different possible sources
        const name = response.data.firstName || 
                    (response.data.user && response.data.user.firstName) || 
                    response.data.name || 
                    "User";
        setUserName(name);
        localStorage.setItem("userName", name);

        // Save user role
        const userRole = response.data.role || 
                        (response.data.user && response.data.user.role) || 
                        "customer";
        localStorage.setItem("role", userRole);

        toast.success(`${currState} successful!`);

        // Role-based redirect
        if (userRole === 'restaurant_owner') {
          navigate('/restaurant-dashboard');
        } else if (userRole === 'delivery_agent') {
          navigate('/delivery-dashboard');
        } else {
          setShowLogin(false); // Customer → just close popup
        }
      } else {
        const errorMessage = response.data.message || "An unexpected error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      const msg = err.response?.data?.message || 
                  err.message || 
                  "Login failed. Please check your credentials.";
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
      <motion.div
        className='login-popup'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.form
          onSubmit={onLogin}
          className="login-popup-container"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="login-popup-title">
            <h2>{currState}</h2>
            <img
              onClick={() => setShowLogin(false)}
              src={assets.cross_icon}
              alt="Close"
              style={{ cursor: 'pointer' }}
            />
          </div>

          <AnimatePresence mode="wait">
            {currState === "Login" ? (
              <motion.div
                key="login"
                className="login-popup-inputs"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {error && <p className="error-message">{error}</p>}
                <input
                  name='email'
                  type="email"
                  value={data.email}
                  onChange={onChangeHandler}
                  placeholder='Your email'
                  required
                />
                <input
                  name='password'
                  type="password"
                  value={data.password}
                  onChange={onChangeHandler}
                  placeholder='Password'
                  required
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                className="login-popup-inputs"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {error && <p className="error-message">{error}</p>}

                <label htmlFor="role-select">I am a:</label>
                <select
                  id="role-select"
                  name="role"
                  value={data.role}
                  onChange={onChangeHandler}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="restaurant_owner">Restaurant Partner</option>
                  <option value="delivery_agent">Delivery Partner</option>
                </select>

                <input
                  name='firstName'
                  type="text"
                  value={data.firstName}
                  onChange={onChangeHandler}
                  placeholder='First Name'
                  required
                />
                <input
                  name='lastName'
                  type="text"
                  value={data.lastName}
                  onChange={onChangeHandler}
                  placeholder='Last Name'
                />
                <input
                  name='phone_number'
                  type="tel"
                  value={data.phone_number}
                  onChange={onChangeHandler}
                  placeholder='Phone number'
                />
                <input
                  name='email'
                  type="email"
                  value={data.email}
                  onChange={onChangeHandler}
                  placeholder='Your email'
                  required
                />
                <input
                  name='password'
                  type="password"
                  value={data.password}
                  onChange={onChangeHandler}
                  placeholder='Password (min 8 characters)'
                  required
                  minLength={8}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type='submit'
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
          >
            {isLoading 
              ? `${currState === "Login" ? "Logging in..." : "Creating account..."}` 
              : `${currState === "Login" ? "Login" : "Create account"}`
            }
          </motion.button>

          {currState === "Sign Up" && (
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>
          )}

          {currState === "Login"
            ? <p>Create a new account? <span onClick={() => { setCurrState('Sign Up'); setError(""); }}>Click here</span></p>
            : <p>Already have an account? <span onClick={() => { setCurrState('Login'); setError(""); }}>Login here</span></p>
          }
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginPopup;