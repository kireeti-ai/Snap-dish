// Sidebar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">🍴 Restaurant Admin</h2>
      <nav className="flex flex-col gap-3">
        <Link to="/" className="hover:text-blue-600 p-2 rounded hover:bg-blue-50">Dashboard</Link>
        
        {user?.role === "restaurant_owner" && (
          <>
            <Link to="/restaurants" className="hover:text-blue-600 p-2 rounded hover:bg-blue-50">Restaurants</Link>
            <Link to="/menu" className="hover:text-blue-600 p-2 rounded hover:bg-blue-50">Menu</Link>
          </>
        )}
        
        <Link to="/orders" className="hover:text-blue-600 p-2 rounded hover:bg-blue-50">Orders</Link>
        
        {user?.role === "admin" && (
          <>
            <Link to="/users" className="hover:text-blue-600 p-2 rounded hover:bg-blue-50">Users</Link>
            <Link to="/reports" className="hover:text-blue-600 p-2 rounded hover:bg-blue-50">Reports</Link>
          </>
        )}
        
        <Link to="/settings" className="hover:text-blue-600 p-2 rounded hover:bg-blue-50">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;