import { useState, useEffect } from "react";
import axios from 'axios';

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
    image: null,
  });
  const [preview, setPreview] = useState(null);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Get auth headers
  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${getAuthToken()}`,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Fetch restaurant data for the logged-in user
  const fetchRestaurantData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurants/my-restaurant`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setRestaurantData(response.data.data);
        return response.data.data._id; // Return restaurant ID
      } else {
        alert("Please create your restaurant profile first!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      alert("Error fetching restaurant data");
      return null;
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!newItem.name || !newItem.price || !newItem.category || !newItem.image) {
      alert("Please fill in all required fields and select an image!");
      return;
    }

    if (!restaurantData) {
      alert("Restaurant data not loaded!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("price", Number(newItem.price));
    formData.append("category", newItem.category);
    formData.append("image", newItem.image);
    formData.append("restaurantId", restaurantData._id);

    try {
      const response = await axios.post(`${API_URL}/api/menu/add`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        alert("Menu Item Added Successfully!");
        setNewItem({ name: "", description: "", price: "", category: "", image: null });
        setPreview(null);
        fetchMenuItems();
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("An error occurred while adding the item.");
    }
  };
  
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const response = await axios.post(`${API_URL}/api/menu/remove`, { id: itemId }, {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        alert("Item removed!");
        fetchMenuItems();
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item.");
    }
  };
  
  const fetchMenuItems = async () => {
    if (!restaurantData) return;
    
    try {
      const response = await axios.get(`${API_URL}/api/menu/list/${restaurantData._id}`);
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const restaurantId = await fetchRestaurantData();
      if (restaurantId) {
        await fetchMenuItems();
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  // Fetch menu items when restaurant data changes
  useEffect(() => {
    if (restaurantData) {
      fetchMenuItems();
    }
  }, [restaurantData]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
        <div className="text-center">Loading restaurant data...</div>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">No Restaurant Found</h2>
          <p className="text-gray-600">Please create your restaurant profile first before managing menu items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      {/* Restaurant Info Header */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          🍽️ Menu Management
        </h2>
        <div className="text-center text-gray-600">
          <p className="font-semibold">{restaurantData.name}</p>
          <p className="text-sm">{restaurantData.cuisine} • {restaurantData.address}</p>
        </div>
      </div>

      <form onSubmit={handleAddItem} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleChange}
            placeholder="Food Item Name"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="number"
            name="price"
            value={newItem.price}
            onChange={handleChange}
            placeholder="Price (e.g. 199)"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        
        <textarea
          name="description"
          value={newItem.description}
          onChange={handleChange}
          placeholder="Description"
          rows="3"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        
        <input
          type="text"
          name="category"
          value={newItem.category}
          onChange={handleChange}
          placeholder="Category (e.g. Appetizer, Main Course, Dessert)"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Food Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none p-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-full h-40 object-cover rounded-lg border"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg shadow font-semibold"
        >
          ➕ Add Item to Menu
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        📋 Current Menu ({menuItems.length} items)
      </h3>
      
      {menuItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No menu items added yet.</p>
          <p className="text-sm">Add your first item using the form above!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`${API_URL}/uploads/foods/${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg">{item.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    {item.is_veg && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        🌱 Veg
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition ml-4"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;