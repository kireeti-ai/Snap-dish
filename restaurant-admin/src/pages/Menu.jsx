// MenuManagement.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://snap-dish.onrender.com";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    is_veg: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  // Modal state for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const getAuthToken = () => localStorage.getItem("token");
  const getAuthHeaders = () => ({ Authorization: `Bearer ${getAuthToken()}` });

  const handleChange = (e, setItem) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, setItem, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setItem((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchRestaurantData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurants/my-restaurant`, {
        headers: getAuthHeaders(),
      });
      if (response.data.success) {
        setRestaurantData(response.data.data);
        return response.data.data._id;
      } else {
        toast.error("Please create your restaurant profile first!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      toast.error("Error fetching restaurant data");
      return null;
    }
  };

  const fetchMenuItems = async () => {
    if (!restaurantData) return;
    try {
      const response = await axios.get(`${API_URL}/api/menu/list/${restaurantData._id}`);
      if (response.data.success) setMenuItems(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.category || !newItem.image) {
      toast.error("Please fill all required fields!");
      return;
    }
    if (!restaurantData) {
      toast.error("Restaurant not found!");
      return;
    }

    const formData = new FormData();
    Object.keys(newItem).forEach((key) => formData.append(key, newItem[key]));
    formData.append("restaurantId", restaurantData._id);

    try {
      const response = await axios.post(`${API_URL}/api/menu/add`, formData, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success("Menu Item Added!");
        setNewItem({ name: "", description: "", price: "", category: "", is_veg: "", image: null });
        setPreview(null);
        fetchMenuItems();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Error adding menu item.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await axios.post(`${API_URL}/api/menu/remove`, { id: itemId }, {
        headers: getAuthHeaders(),
      });
      if (response.data.success) {
        toast.success("Item removed!");
        fetchMenuItems();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting menu item.");
    }
  };

  const openEditModal = (item) => {
    setEditItem({ ...item, is_veg: item.is_veg ? "true" : "false" });
    setEditPreview(`${API_URL}/uploads/foods/${item.image}`);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const formData = new FormData();
      Object.keys(editItem).forEach((key) => {
        if (key !== "image" || editItem.image instanceof File) formData.append(key, editItem[key]);
      });
      formData.append("id", editItem._id);

      const response = await axios.put(`${API_URL}/api/menu/update`, formData, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Item updated!");
        setIsEditModalOpen(false);
        fetchMenuItems();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Error updating item.");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const restaurantId = await fetchRestaurantData();
      if (restaurantId) await fetchMenuItems();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (restaurantData) fetchMenuItems();
  }, [restaurantData]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!restaurantData) return <div className="text-center p-6">No Restaurant Found!</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <h2 className="text-2xl font-bold text-center mb-6">🍽️ Menu Management</h2>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="space-y-4 mb-8">
        <input type="text" name="name" value={newItem.name} onChange={(e) => handleChange(e, setNewItem)} placeholder="Food Name" required className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
        <input type="number" name="price" value={newItem.price} onChange={(e) => handleChange(e, setNewItem)} placeholder="Price" required className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
        <textarea name="description" value={newItem.description} onChange={(e) => handleChange(e, setNewItem)} placeholder="Description" rows="3" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
        <input type="text" name="category" value={newItem.category} onChange={(e) => handleChange(e, setNewItem)} placeholder="Category" required className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
        <select name="is_veg" value={newItem.is_veg} onChange={(e) => handleChange(e, setNewItem)} className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none mb-3">
          <option value="">Select Type</option>
          <option value="true">🌱 Veg</option>
          <option value="false">🍖 Non-Veg</option>
        </select>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setNewItem, setPreview)} required className="mb-3" />
        {preview && <img src={preview} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-lg" />}
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition">➕ Add Item</button>
      </form>

      {/* Menu Items */}
      <h3 className="text-xl font-semibold mb-4">📋 Current Menu ({menuItems.length})</h3>
      <div className="grid gap-4">
        {menuItems.map((item) => (
          <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-4">
              <img src={`${API_URL}/uploads/foods/${item.image}`} alt={item.name} className="w-20 h-20 object-cover rounded-lg border" />
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
                <span className="font-bold text-green-600">₹{item.price}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => openEditModal(item)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow font-semibold">✏️ Edit</button>
              <button onClick={() => handleDeleteItem(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow font-semibold">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4">Edit Menu Item</h3>
            <input type="text" name="name" value={editItem.name} onChange={(e) => handleChange(e, setEditItem)} placeholder="Food Name" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
            <input type="number" name="price" value={editItem.price} onChange={(e) => handleChange(e, setEditItem)} placeholder="Price" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
            <textarea name="description" value={editItem.description} onChange={(e) => handleChange(e, setEditItem)} placeholder="Description" rows="3" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
            <input type="text" name="category" value={editItem.category} onChange={(e) => handleChange(e, setEditItem)} placeholder="Category" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
            <select
              name="is_veg"
              value={newItem.is_veg}
              onChange={(e) => handleChange(e, setNewItem)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 mb-3"
            >
              <option value="" disabled>Select Type</option>
              <option value="true">🌱 Veg</option>
              <option value="false">🍖 Non-Veg</option>
            </select>
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setEditItem, setEditPreview)} className="mb-3" />
            {editPreview && <img src={editPreview} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-lg" />}
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow font-semibold">Cancel</button>
              <button onClick={handleEditSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow font-semibold">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;