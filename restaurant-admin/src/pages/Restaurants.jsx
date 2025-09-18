import { useState } from "react";

const Restaurants = () => {
  const [restaurant, setRestaurant] = useState({
    name: "My Restaurant",
    address: "123 Main St",
    cuisine: "Indian",
    price_for_two: 500,
    status: "active",
    timing: "10:00 AM - 10:00 PM",
    image: null, // for image upload
  });

  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRestaurant((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file)); // preview
    }
  };

  const handleSave = () => {
    console.log("Updated restaurant:", restaurant);
    // TODO: send to backend with FormData if API supports file uploads
    setIsEditing(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🍽️ Manage Restaurant
      </h2>

      {isEditing ? (
        <div className="space-y-4">
          {/* Image Upload */}
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
          />
          <input
            type="text"
            name="address"
            value={restaurant.address}
            onChange={handleChange}
            placeholder="Address"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="cuisine"
            value={restaurant.cuisine}
            onChange={handleChange}
            placeholder="Cuisine"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="number"
            name="price_for_two"
            value={restaurant.price_for_two}
            onChange={handleChange}
            placeholder="Price for Two"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="timing"
            value={restaurant.timing}
            onChange={handleChange}
            placeholder="Opening Hours"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
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
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow transition"
            >
              Cancel
            </button>
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
          <p><span className="font-semibold">Status:</span> {restaurant.status}</p>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            ✏️ Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
