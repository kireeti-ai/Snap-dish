const Navbar = () => {
  return (
    <header className="flex justify-between items-center bg-white px-6 py-3 shadow">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <span>Admin</span>
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
