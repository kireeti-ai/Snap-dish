import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- CHANGE: Using an environment variable for the API URL ---
// You should create a .env file in your project's root folder and add:
// VITE_API_URL="https://snap-dish.onrender.com"
const API_URL ="https://snap-dish.onrender.com";


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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const getAuthToken = () => localStorage.getItem("token");
  const getAuthHeaders = () => ({ Authorization: `Bearer ${getAuthToken()}` });

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
      const errorMessage = error.response?.data?.message || "You must create a restaurant profile before adding menu items.";
      toast.error(errorMessage);
      return null;
    }
  };

  const fetchMenuItems = async (restaurantId) => {
    if (!restaurantId) return;
    try {
      const response = await axios.get(`${API_URL}/api/menu/list/${restaurantId}`);
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const restaurantId = await fetchRestaurantData();
      if (restaurantId) {
        await fetchMenuItems(restaurantId);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleChange = (e, setItem) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, setItem, setPreviewState) => {
    const file = e.target.files[0];
    if (file) {
      setItem((prev) => ({ ...prev, image: file }));
      setPreviewState(URL.createObjectURL(file));
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.category || !newItem.is_veg || !newItem.image) {
      toast.error("Please fill all required fields, including the image!");
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
        e.target.reset(); // Resets the form fields
        await fetchMenuItems(restaurantData._id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // --- CHANGE: More specific error message ---
      const errorMessage = error.response?.data?.message || "Error adding menu item.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await axios.delete(`${API_URL}/api/menu/remove/${itemId}`, {
        headers: getAuthHeaders(),
      });
      if (response.data.success) {
        toast.success("Item removed!");
        await fetchMenuItems(restaurantData._id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // --- CHANGE: More specific error message ---
      const errorMessage = error.response?.data?.message || "Error deleting menu item.";
      toast.error(errorMessage);
    }
  };

  const openEditModal = (item) => {
    setEditItem({ ...item, is_veg: item.is_veg ? "true" : "false" });
    setEditPreview(item.image || null);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    const formData = new FormData();
    Object.keys(editItem).forEach((key) => {
      // Only append a new image file if it's been changed
      if (key !== "image" || editItem.image instanceof File) {
        formData.append(key, editItem[key]);
      }
    });
    formData.append("id", editItem._id);

    try {
      const response = await axios.put(`${API_URL}/api/menu/update`, formData, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Item updated!");
        setIsEditModalOpen(false);
        await fetchMenuItems(restaurantData._id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // --- CHANGE: More specific error message ---
      const errorMessage = error.response?.data?.message || "Error updating item.";
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="text-center p-10 text-lg">Loading Menu...</div>;
  if (!restaurantData) return <div className="text-center p-10 text-lg text-red-600">Could not find your restaurant. Please create one first.</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <p className="mt-2 text-md text-gray-500">Add, edit, or remove items from your restaurant's menu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* LEFT COLUMN: ADD ITEM FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Item</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <input type="text" name="name" onChange={(e) => handleChange(e, setNewItem)} placeholder="Food Name*" required className="w-full p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
              <textarea name="description" onChange={(e) => handleChange(e, setNewItem)} placeholder="Description" rows="3" className="w-full p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" name="price" onChange={(e) => handleChange(e, setNewItem)} placeholder="Price*" required className="w-full p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
                <input type="text" name="category" onChange={(e) => handleChange(e, setNewItem)} placeholder="Category*" required className="w-full p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
              </div>
              <select name="is_veg" defaultValue="" onChange={(e) => handleChange(e, setNewItem)} required className="w-full p-3 bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Select Type*</option>
                <option value="true">🌱 Veg</option>
                <option value="false">🍖 Non-Veg</option>
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image*</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setNewItem, setPreview)} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              </div>
              {preview && <img src={preview} alt="New item preview" className="mt-2 w-full h-40 object-cover rounded-lg" />}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">Add Item to Menu</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: CURRENT MENU */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Menu ({menuItems.length})</h2>
          <div className="space-y-4">
            {menuItems.length > 0 ? menuItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-600 truncate">{item.description}</p>
                    <span className="font-bold text-green-700">₹{item.price}</span>
                    <span className="ml-3 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{item.category}</span>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0 ml-4">
                  <button onClick={() => openEditModal(item)} className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold p-2 rounded-lg text-sm">Edit</button>
                  <button onClick={() => handleDeleteItem(item._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-lg text-sm">Delete</button>
                </div>
              </div>
            )) : <p className="text-gray-500 text-center py-10">Your menu is empty. Add an item using the form on the left.</p>}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4">Edit Menu Item</h3>
            <div className="space-y-4">
              <input type="text" name="name" value={editItem.name} onChange={(e) => handleChange(e, setEditItem)} className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="number" name="price" value={editItem.price} onChange={(e) => handleChange(e, setEditItem)} className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <textarea name="description" value={editItem.description} onChange={(e) => handleChange(e, setEditItem)} rows="3" className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="category" value={editItem.category} onChange={(e) => handleChange(e, setEditItem)} className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <select name="is_veg" value={editItem.is_veg} onChange={(e) => handleChange(e, setEditItem)} className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="true">🌱 Veg</option>
                <option value="false">🍖 Non-Veg</option>
              </select>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setEditItem, setEditPreview)} className="w-full text-sm text-gray-500"/>
              {editPreview && <img src={editPreview} alt="Edit preview" className="mt-2 w-full h-40 object-cover rounded-lg" />}
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg">Cancel</button>
              <button onClick={handleEditSave} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;