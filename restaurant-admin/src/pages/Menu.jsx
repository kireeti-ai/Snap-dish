import { useState } from "react";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Add item to menu
  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category) {
      alert("Please fill in all required fields!");
      return;
    }

    const newEntry = {
      ...newItem,
      id: Date.now(), // temporary unique id
      imagePreview: preview,
    };

    setMenuItems((prev) => [...prev, newEntry]);
    setNewItem({ name: "", description: "", price: "", category: "", image: null });
    setPreview(null);
  };

  // Delete item
  const handleDeleteItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        🍔 Menu Management
      </h2>

      {/* Add New Food Item Form */}
      <div className="space-y-4 mb-8">
        <input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleChange}
          placeholder="Food Item Name"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <textarea
          name="description"
          value={newItem.description}
          onChange={handleChange}
          placeholder="Description"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="number"
          name="price"
          value={newItem.price}
          onChange={handleChange}
          placeholder="Price (e.g. 199)"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          name="category"
          value={newItem.category}
          onChange={handleChange}
          placeholder="Category (e.g. Appetizer, Main Course)"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Food Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
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
          onClick={handleAddItem}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow"
        >
          ➕ Add Item
        </button>
      </div>

      {/* Menu Items List */}
      <h3 className="text-xl font-semibold mb-4 text-gray-800">📋 Current Menu</h3>
      {menuItems.length === 0 ? (
        <p className="text-gray-500">No menu items added yet.</p>
      ) : (
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                {item.imagePreview && (
                  <img
                    src={item.imagePreview}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-700">
                    ₹{item.price} • {item.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
              >
                🗑️ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuManagement;
