import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// --- API Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Notification Component ---
const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;

  const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 z-50";
  const typeClasses = { success: "bg-green-500", error: "bg-red-500" };

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return <div className={`${baseClasses} ${typeClasses[type] || 'bg-gray-700'}`}>{message}</div>;
};

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, title, message, isConfirming }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition disabled:bg-red-400"
          >
            {isConfirming ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const Restaurants = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    cuisine: "",
    price_for_two: "",
    status: "pending_approval",
    timing: "",
    image: null
  });

  const [originalRestaurant, setOriginalRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [hasRestaurant, setHasRestaurant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const showNotification = (message, type = 'success') => setNotification({ message, type });

  const fetchRestaurantData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/restaurants/my-restaurant");
      if (data.success) {
        setRestaurant(data.data);
        setOriginalRestaurant(data.data);
        setHasRestaurant(true);
        if (data.data.image) setPreview(data.data.image);
      } else {
        setHasRestaurant(false);
        setIsEditing(true);
      }
    } catch (err) {
      console.log("No restaurant found, showing create form");
      setHasRestaurant(false);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRestaurantData(); }, [fetchRestaurantData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image size should be less than 5MB", 'error');
        return;
      }
      setRestaurant(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setRestaurant(originalRestaurant);
    setPreview(originalRestaurant?.image || null);
    setIsEditing(false);
  };

  const validateForm = () => {
    if (!restaurant.name.trim()) {
      showNotification("Restaurant name is required", 'error');
      return false;
    }
    if (!restaurant.address.trim()) {
      showNotification("Address is required", 'error');
      return false;
    }
    if (!restaurant.cuisine.trim()) {
      showNotification("Cuisine is required", 'error');
      return false;
    }
    if (!restaurant.price_for_two || restaurant.price_for_two <= 0) {
      showNotification("Valid price for two is required", 'error');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const formData = new FormData();

      // Append all fields
      formData.append('name', restaurant.name);
      formData.append('address', restaurant.address);
      formData.append('cuisine', restaurant.cuisine);
      formData.append('price_for_two', restaurant.price_for_two);
      formData.append('status', restaurant.status);
      if (restaurant.timing) formData.append('timing', restaurant.timing);

      // Only append image if it's a new File object
      if (restaurant.image instanceof File) {
        formData.append('image', restaurant.image);
      }

      // FIXED: Use correct endpoints
      const endpoint = hasRestaurant ? "/api/restaurants/update" : "/api/restaurants/create";
      const { data } = await api({
        method: hasRestaurant ? 'put' : 'post',
        url: endpoint,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        showNotification(`Restaurant ${hasRestaurant ? 'updated' : 'created'} successfully!`, 'success');
        setRestaurant(data.data);
        setOriginalRestaurant(data.data);
        setHasRestaurant(true);
        setIsEditing(false);
        if (data.data.image) setPreview(data.data.image);
      } else {
        showNotification(data.message || "Failed to save details.", 'error');
      }
    } catch (err) {
      console.error("Save error:", err);
      showNotification(err.response?.data?.message || "Server error. Try again.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      // FIXED: Use correct endpoint
      const { data } = await api.delete("/api/restaurants/delete");
      if (data.success) {
        showNotification("Restaurant deleted successfully!", 'success');
        setHasRestaurant(false);
        setRestaurant({
          name: "", address: "", cuisine: "", price_for_two: "",
          status: "pending_approval", timing: "", image: null
        });
        setPreview(null);
        setOriginalRestaurant(null);
        setIsEditing(true);
      } else {
        showNotification(data.message || "Failed to delete restaurant.", 'error');
      }
    } catch (err) {
      console.error("Delete error:", err);
      showNotification(err.response?.data?.message || "Server error during deletion.", 'error');
    } finally {
      setIsSaving(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-500">Loading Your Restaurant...</p>
        </div>
      </div>
    );
  }

  const DetailRow = ({ label, value, children }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-200">
      <dt className="text-sm font-medium text-gray-600">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 col-span-2 sm:mt-0">{children || value || 'N/A'}</dd>
    </div>
  );

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        onDismiss={() => setNotification({ message: '', type: '' })}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure? This will permanently delete your restaurant and all its data."
        isConfirming={isSaving}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {hasRestaurant ? 'Manage Your Restaurant' : 'Register Your Restaurant'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isEditing ? "Fill in the details below to get started." : "Review your restaurant's information."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          {/* --- Restaurant Image --- */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Restaurant Image</h3>
            <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="Restaurant" className="object-cover w-full h-full" />
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm">No Image Uploaded</p>
                </div>
              )}
            </div>
            {isEditing && (
              <div className="mt-4">
                <label htmlFor="image-upload" className="cursor-pointer w-full inline-block text-center bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition">
                  {preview ? 'Change Image' : 'Upload Image'}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="mt-2 text-xs text-gray-500 text-center">Max size: 5MB</p>
              </div>
            )}
          </div>

          {/* --- Restaurant Details --- */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    value={restaurant.name}
                    onChange={handleChange}
                    placeholder="Restaurant Name *"
                    className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="cuisine"
                    value={restaurant.cuisine}
                    onChange={handleChange}
                    placeholder="Cuisine (e.g., Italian) *"
                    className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  value={restaurant.address}
                  onChange={handleChange}
                  placeholder="Full Address *"
                  className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input
                    type="number"
                    name="price_for_two"
                    value={restaurant.price_for_two}
                    onChange={handleChange}
                    placeholder="Avg. Price for Two (₹) *"
                    className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                  />
                  <input
                    type="text"
                    name="timing"
                    value={restaurant.timing}
                    onChange={handleChange}
                    placeholder="Timings (e.g., 9 AM - 11 PM)"
                    className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  name="status"
                  value={restaurant.status}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending_approval">Pending Approval</option>
                </select>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  {hasRestaurant && (
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-blue-400"
                  >
                    {isSaving ? 'Saving...' : (hasRestaurant ? 'Update Details' : 'Create Restaurant')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <dl>
                  <DetailRow label="Name" value={restaurant.name} />
                  <DetailRow label="Cuisine" value={restaurant.cuisine} />
                  <DetailRow label="Address" value={restaurant.address} />
                  <DetailRow label="Price for Two" value={`₹${restaurant.price_for_two}`} />
                  <DetailRow label="Timings" value={restaurant.timing} />
                  <DetailRow label="Status">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${restaurant.status === 'active' ? 'bg-green-100 text-green-800' :
                      restaurant.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {restaurant.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </DetailRow>
                </dl>
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Edit Restaurant
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    disabled={isSaving}
                    className="w-full px-6 py-3 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
                  >
                    Delete Restaurant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurants;