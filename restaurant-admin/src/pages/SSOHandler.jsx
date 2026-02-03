// SSOHandler.jsx - Handles Single Sign-On from Food app
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const SSOHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");

        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));

                // Verify the user has restaurant_owner or admin role
                if (user.role !== 'restaurant_owner' && user.role !== 'admin') {
                    toast.error(`Access denied. This portal is for restaurant owners only. Your role is: ${user.role}`);
                    navigate("/login");
                    return;
                }

                // Store credentials and login
                login(user, decodeURIComponent(token));
                toast.success(`Welcome, ${user.firstName || 'Restaurant Owner'}!`);

                // Redirect to dashboard
                navigate("/", { replace: true });
            } catch (error) {
                console.error("SSO Error:", error);
                toast.error("Invalid SSO credentials. Please login manually.");
                navigate("/login");
            }
        } else {
            toast.error("Missing SSO credentials. Please login manually.");
            navigate("/login");
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-center mt-4 text-gray-600">Authenticating...</p>
            </div>
        </div>
    );
};

export default SSOHandler;
