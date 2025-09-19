import { useState, useEffect } from "react";
import axios from "axios";
const Restaurants = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    cuisine: "",
    price_for_two: "",
    status: "pending_approval",
    timing: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [hasRestaurant, setHasRestaurant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const getAuthToken = () => localStorage.getItem("token");
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(
          "https://snap-dish.onrender.com/api/restaurants/my-restaurant",
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );

        if (response.data.success) {
          setRestaurant(response.data.data);
          setHasRestaurant(true);
          if (response.data.data.image) {
            setPreview(`https://snap-dish.onrender.com/uploads/restaurants/${response.data.data.image}`);
          }
        }
      } catch (error) {
        console.log("No restaurant found, can create new one");
        setHasRestaurant(false);
      }
      setLoading(false);
    };

    fetchRestaurantData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRestaurant((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", restaurant.name);
      formData.append("address", restaurant.address);
      formData.append("cuisine", restaurant.cuisine);
      formData.append("price_for_two", restaurant.price_for_two);
      formData.append("status", restaurant.status);
      formData.append("timing", restaurant.timing);
      if (restaurant.image && typeof restaurant.image === 'object') {
        formData.append("image", restaurant.image);
      }

      const token = getAuthToken();
      const url = hasRestaurant 
        ? "https://snap-dish.onrender.com/api/restaurants/my-restaurant"
        : "https://snap-dish.onrender.com/api/restaurants";
      
      const method = hasRestaurant ? 'put' : 'post';

      const { data } = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        alert(`Restaurant ${hasRestaurant ? 'updated' : 'created'} successfully!`);
        setIsEditing(false);
        setHasRestaurant(true);
        setRestaurant(data.data);
        // Update preview with correct path after save
        if (data.data.image) {
          setPreview(`https://snap-dish.onrender.com/uploads/restaurants/${data.data.image}`);
        }
      } else {
        alert(data.message || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your restaurant? This action cannot be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      const token = getAuthToken();
      const { data } = await axios.delete(
        "https://snap-dish.onrender.com/api/restaurants/my-restaurant",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        alert("Restaurant deleted successfully!");
        setHasRestaurant(false);
        setRestaurant({
          name: "",
          address: "",
          cuisine: "",
          price_for_two: "",
          status: "pending_approval",
          timing: "",
          image: null,
        });
        setPreview(null);
        setIsEditing(false);
      } else {
        alert(data.message || "Failed to delete restaurant");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🍽️ {hasRestaurant ? 'Manage Restaurant' : 'Create Restaurant'}
      </h2>

      {isEditing || !hasRestaurant ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Restaurant Image
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

          <input
            type="text"
            name="name"
            value={restaurant.name}
            onChange={handleChange}
            placeholder="Restaurant Name"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            name="address"
            value={restaurant.address}
            onChange={handleChange}
            placeholder="Address"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            name="cuisine"
            value={restaurant.cuisine}
            onChange={handleChange}
            placeholder="Cuisine"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="number"
            name="price_for_two"
            value={restaurant.price_for_two}
            onChange={handleChange}
            placeholder="Price for Two"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            name="timing"
            value={restaurant.timing}
            onChange={handleChange}
            placeholder="Opening Hours (e.g., 10:00 AM - 10:00 PM)"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <select
            name="status"
            value={restaurant.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="active">✅ Active</option>
            <option value="inactive">❌ Inactive</option>
            <option value="pending_approval">⏳ Pending Approval</option>
          </select>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
              {hasRestaurant ? 'Update' : 'Create'}
            </button>
            {hasRestaurant && (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-gray-700">
          {preview && (
            <img
              src={preview}
              alt={restaurant.name}
              className="w-full h-40 object-cover rounded-lg border mb-4"
            />
          )}
          <p><span className="font-semibold">Name:</span> {restaurant.name}</p>
          <p><span className="font-semibold">Address:</span> {restaurant.address}</p>
          <p><span className="font-semibold">Cuisine:</span> {restaurant.cuisine}</p>
          <p><span className="font-semibold">Price for Two:</span> ₹{restaurant.price_for_two}</p>
          <p><span className="font-semibold">Timing:</span> {restaurant.timing}</p>
          <p><span className="font-semibold">Status:</span> 
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              restaurant.status === 'active' ? 'bg-green-100 text-green-800' :
              restaurant.status === 'inactive' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {restaurant.status}
            </span>
          </p>

          <div className="space-y-3 pt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
              ✏️ Edit Restaurant
            </button>
            
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-2 rounded-lg shadow transition"
            >
              {deleting ? "Deleting..." : "🗑️ Delete Restaurant"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;