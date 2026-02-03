// SSOHandler.jsx - Handles Single Sign-On from Food app
import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const SSOHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const handleSSO = async () => {
            const token = searchParams.get("token");
            const userParam = searchParams.get("user");

            if (token && userParam) {
                try {
                    const user = JSON.parse(decodeURIComponent(userParam));

                    // Verify the user has delivery_agent role
                    if (user.role !== 'delivery_agent') {
                        toast.error(`Access denied. This portal is for delivery agents only. Your role is: ${user.role}`);
                        navigate("/login");
                        return;
                    }

                    // Store credentials
                    localStorage.setItem("token", decodeURIComponent(token));
                    localStorage.setItem("user", JSON.stringify(user));

                    toast.success(`Welcome, ${user.firstName || 'Delivery Partner'}!`);

                    // Redirect to dashboard and reload to update context
                    setTimeout(() => {
                        navigate("/", { replace: true });
                        window.location.reload();
                    }, 100);
                } catch (error) {
                    console.error("SSO Error:", error);
                    toast.error("Invalid SSO credentials. Please login manually.");
                    navigate("/login");
                }
            } else {
                toast.error("Missing SSO credentials. Please login manually.");
                navigate("/login");
            }
        };

        handleSSO();
    }, [searchParams, navigate]);

    return (
        <div className="login-page-container">
            <div className="login-card" style={{ textAlign: 'center' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #ff6b35',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                }}></div>
                <p style={{ color: '#666' }}>Authenticating...</p>
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        </div>
    );
};

export default SSOHandler;
