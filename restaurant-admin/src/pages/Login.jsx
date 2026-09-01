// Login.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email: email.trim().toLowerCase(),
        password
      });

      if (response.data.success) {
        if (response.data.role !== 'restaurant_owner' && response.data.role !== 'admin') {
          setError(`Access denied. This portal is for restaurant owners only. Your role is: ${response.data.role}`);
          setLoading(false);
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
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Restaurant Admin Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          minLength={8}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;