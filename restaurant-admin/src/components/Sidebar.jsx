import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">🍴 Restaurant Admin</h2>
      <nav className="flex flex-col gap-3">
        <Link to="/" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/restaurants" className="hover:text-blue-600">Restaurants</Link>
        <Link to="/menu" className="hover:text-blue-600">Menu</Link>
        <Link to="/orders" className="hover:text-blue-600">Orders</Link>
        <Link to="/users" className="hover:text-blue-600">Users</Link>
        <Link to="/reports" className="hover:text-blue-600">Reports</Link>
        <Link to="/settings" className="hover:text-blue-600">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
