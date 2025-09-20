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
  
  const [originalRestaurant, setOriginalRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [hasRestaurant, setHasRestaurant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://snap-dish.onrender.com/api/restaurants/my-restaurant",
          {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
          }
        );

        if (response.data.success) {
          setRestaurant(response.data.data);
          setOriginalRestaurant(response.data.data);
          setHasRestaurant(true);
          if (response.data.data.image) {
            setPreview(`https://snap-dish.onrender.com/uploads/restaurants/${response.data.data.image}`);
          }
        } else {
          setHasRestaurant(false);
          setIsEditing(true);
        }
      } catch (error) {
        console.log("No restaurant found, enabling creation form.");
        setHasRestaurant(false);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
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
  
  const handleCancel = () => {
      setRestaurant(originalRestaurant);
      if (originalRestaurant?.image) {
          setPreview(`https://snap-dish.onrender.com/uploads/restaurants/${originalRestaurant.image}`);
      } else {
          setPreview(null);
      }
      setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(restaurant).forEach(key => {
        if (key === 'image' && restaurant.image instanceof File) {
            formData.append(key, restaurant.image);
        } else if (key !== 'image') {
            formData.append(key, restaurant[key]);
        }
      });

      const token = getAuthToken();
      const url = hasRestaurant 
        ? "https://snap-dish.onrender.com/api/restaurants/my-restaurant"
        : "https://snap-dish.onrender.com/api/restaurants";
      
      const method = hasRestaurant ? 'put' : 'post';
      const { data } = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        alert(`Restaurant ${hasRestaurant ? 'updated' : 'created'} successfully!`);
        setRestaurant(data.data);
        setOriginalRestaurant(data.data);
        setHasRestaurant(true);
        setIsEditing(false);
        if (data.data.image) {
          setPreview(`https://snap-dish.onrender.com/uploads/restaurants/${data.data.image}`);
        }
      } else {
        alert(data.message || "Failed to save details.");
      }
    } catch (err) {
      console.error(err);
      alert("A server error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your restaurant and all its data.")) return;
    
    setIsSaving(true);
    try {
      const { data } = await axios.delete(
        "https://snap-dish.onrender.com/api/restaurants/my-restaurant",
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );

      if (data.success) {
        alert("Restaurant deleted successfully!");
        setHasRestaurant(false);
        setRestaurant({ name: "", address: "", cuisine: "", price_for_two: "", status: "pending_approval", timing: "", image: null });
        setPreview(null);
        setOriginalRestaurant(null);
        setIsEditing(true);
      } else {
        alert(data.message || "Failed to delete restaurant.");
      }
    } catch (err) {
      console.error(err);
      alert("A server error occurred during deletion.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading Your Restaurant...</div>
      </div>
    );
  }

  const DetailRow = ({ label, value, children }) => (
      <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-200">
          <dt className="text-sm font-medium text-gray-600">{label}</dt>
          <dd className="mt-1 text-sm text-gray-900 col-span-2 sm:mt-0">{children || value}</dd>
      </div>
  );

  return (
    // The main container no longer has background, shadow, or border styles.
    // 'py-8' adds vertical spacing from other elements on the page.
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            {hasRestaurant ? 'Manage Your Restaurant' : 'Register Your Restaurant'}
          </h1>
          <p className="text-center text-gray-500 mt-2">
            {isEditing ? "Fill in the details below to get started." : "Review your restaurant's information."}
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        {/* --- LEFT COLUMN: IMAGE --- */}
        <div className="lg:col-span-1 mb-8 lg:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Restaurant Image</h3>
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center">
                {preview ? (
                    <img src={preview} alt="Restaurant" className="object-cover w-full h-full rounded-md"/>
                ) : (
                    <div className="text-center p-4 text-gray-500">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <p className="mt-2 text-sm">No Image Uploaded</p>
                    </div>
                )}
            </div>
            {isEditing && (
                <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer w-full inline-block text-center bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
                        {preview ? 'Change Image' : 'Upload Image'}
                    </label>
                    <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                </div>
            )}
        </div>

        {/* --- RIGHT COLUMN: DETAILS & FORM --- */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="p-8 bg-white border border-gray-200 rounded-lg">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input type="text" name="name" value={restaurant.name} onChange={handleChange} placeholder="Restaurant Name" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required/>
                        <input type="text" name="cuisine" value={restaurant.cuisine} onChange={handleChange} placeholder="Cuisine (e.g., Italian)" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required/>
                    </div>
                    <input type="text" name="address" value={restaurant.address} onChange={handleChange} placeholder="Full Address" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input type="number" name="price_for_two" value={restaurant.price_for_two} onChange={handleChange} placeholder="Avg. Price for Two (₹)" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required/>
                        <input type="text" name="timing" value={restaurant.timing} onChange={handleChange} placeholder="Timings (e.g., 9 AM - 11 PM)" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required/>
                    </div>
                    <select name="status" value={restaurant.status} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending_approval">Pending Approval</option>
                    </select>
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        {hasRestaurant && <button onClick={handleCancel} disabled={isSaving} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition">Cancel</button>}
                        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-blue-400">
                            {isSaving ? 'Saving...' : (hasRestaurant ? 'Update Details' : 'Create Restaurant')}
                        </button>
                    </div>
                </div>
            </div>
          ) : (
            <div className="p-8 bg-white border border-gray-200 rounded-lg">
                <dl>
                    <DetailRow label="Name" value={restaurant.name} />
                    <DetailRow label="Cuisine" value={restaurant.cuisine} />
                    <DetailRow label="Address" value={restaurant.address} />
                    <DetailRow label="Price for Two" value={`₹${restaurant.price_for_two}`} />
                    <DetailRow label="Timings" value={restaurant.timing} />
                    <DetailRow label="Status">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            restaurant.status === 'active' ? 'bg-green-100 text-green-800' :
                            restaurant.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                            {restaurant.status.replace('_', ' ')}
                        </span>
                    </DetailRow>
                </dl>
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button onClick={() => setIsEditing(true)} className="w-full px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition">Edit Restaurant</button>
                    <button onClick={handleDelete} disabled={isSaving} className="w-full px-6 py-3 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition disabled:opacity-50">
                        {isSaving ? "Deleting..." : "Delete Restaurant"}
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;