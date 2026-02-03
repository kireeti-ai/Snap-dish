// Login.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://snap-dish.onrender.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // OTP State
  const [showOtpUI, setShowOtpUI] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUserId, setTempUserId] = useState(null);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/verify-otp`, {
        userId: tempUserId,
        otp: otp
      });

      if (response.data.success) {
        // Check role - allow restaurant_owner or admin
        if (response.data.role !== 'restaurant_owner' && response.data.role !== 'admin') {
          setError("Access denied. This portal is for restaurant owners only.");
          setShowOtpUI(false);
          setOtp("");
          return;
        }

        login(response.data.user, response.data.token);
      } else {
        setError(response.data.message || "OTP verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email: email.trim().toLowerCase(),
        password
      });

      if (response.data.success) {
        // Check if MFA/OTP is required
        if (response.data.mfaRequired) {
          setTempUserId(response.data.userId);
          setShowOtpUI(true);
          setLoading(false);
          return;
        }

        // Direct login (no MFA) - shouldn't happen with current backend
        if (response.data.role !== 'restaurant_owner' && response.data.role !== 'admin') {
          setError("Access denied. This portal is for restaurant owners only.");
          return;
        }

        login(response.data.user, response.data.token);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={showOtpUI ? handleVerifyOTP : handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {showOtpUI ? "Enter OTP" : "Restaurant Admin Login"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {showOtpUI ? (
          <>
            <p className="text-gray-600 text-center mb-4">
              Please enter the 6-digit code sent to {email}
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full border px-3 py-2 mb-4 rounded text-center text-xl tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
            />
            <button
              className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <p
              className="mt-4 text-center text-red-500 cursor-pointer hover:underline"
              onClick={() => { setShowOtpUI(false); setOtp(""); setError(""); }}
            >
              Back to Login
            </p>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;