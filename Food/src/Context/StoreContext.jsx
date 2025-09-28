import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // State management
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [restaurant_list, setRestaurantList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
 
  const BACKEND_URL = "http://localhost:4000";
  const url = BACKEND_URL;
  
  // Auth state
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("customer"); 
  
  // Cart and order management
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [showRestaurantPrompt, setShowRestaurantPrompt] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Location state
  const [location, setLocation] = useState({
    address: "Ettimadai, Coimbatore",
    latitude: 10.8817,
    longitude: 76.9038,
  });

  // API functions with fallback mock data
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/menu/list`);
      if (response.data.success) {
        setFoodList(response.data.data || []);
      } else {
        console.error("Failed to fetch food list:", response.data.message);
        setFoodList([]);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      const mockFoodData = [
        { _id: "1", name: "Margherita Pizza", description: "Classic pizza with tomato sauce and mozzarella", price: 299, category: "Pizza", is_veg: true, restaurant_id: "r1", image: "pizza1.jpg", rating: 4.5 },
        { _id: "2", name: "Chicken Biryani", description: "Aromatic rice dish with tender chicken", price: 349, category: "Biryani", is_veg: false, restaurant_id: "r2", image: "biryani1.jpg", rating: 4.8 }
      ];
      setFoodList(mockFoodData);
      if (toast) {
        toast.error("Using mock data - Backend unavailable");
      }
    }
  };

  const fetchRestaurantList = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurants`);
      if (response.data.success) {
        const sortedRestaurants = (response.data.data || []).sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setRestaurantList(sortedRestaurants);
      } else {
        console.error("Failed to fetch restaurant list:", response.data.message);
        setRestaurantList([]);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      const mockRestaurantData = [
        { _id: "r1", name: "Pizza Palace", cuisine: "Italian", rating: 4.5, timing: "30-40 mins", address: "123 Main St, City", price_for_two: 600, people: 2.3, image: "restaurant1.jpg" },
        { _id: "r2", name: "Biryani House", cuisine: "Indian", rating: 4.3, timing: "25-35 mins", address: "456 Food St, City", price_for_two: 500, people: 1.8, image: "restaurant2.jpg" }
      ];
      setRestaurantList(mockRestaurantData);
      if (toast) {
        toast.error("Using mock data - Backend unavailable");
      }
    }
  };

  // Address API functions
  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/address`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setSavedAddresses(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      if (toast) toast.error("Failed to load addresses");
    }
  };

  const addAddress = async (addressData) => {
    try {
      const res = await axios.post(`${url}/api/address`, addressData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSavedAddresses((prev) => [...prev, res.data.data]);
        if (toast) {
          toast.success("Address added");
        }
      }
    } catch (error) {
      console.error("Error adding address:", error);
      if (toast) {
        toast.error("Failed to add address");
      }
    }
  };

  const updateAddress = async (addressData) => {
    try {
      const res = await axios.put(`${url}/api/address/${addressData._id}`, addressData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSavedAddresses((prev) =>
          prev.map((addr) => (addr._id === addressData._id ? res.data.data : addr))
        );
        if (toast) {
          toast.success("Address updated");
        }
      }
    } catch (error) {
      console.error("Error updating address:", error);
      if (toast) {
        toast.error("Failed to update address");
      }
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await axios.delete(`${url}/api/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSavedAddresses((prev) => prev.filter((addr) => addr._id !== id));
        if (toast) {
          toast.success("Address deleted");
        }
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      if (toast) {
        toast.error("Failed to delete address");
      }
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const updatedAddresses = savedAddresses.map((addr) =>
        addr._id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
      );
      setSavedAddresses(updatedAddresses);
      const selected = updatedAddresses.find((a) => a._id === id);
      if (selected) {
        await updateAddress(selected);
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      if (toast) {
        toast.error("Failed to set default address");
      }
    }
  };

  // Cart logic
  const addToCart = (itemId) => {
    try {
      const itemToAdd = food_list.find((product) => product._id === itemId);
      if (!itemToAdd) return;

      const itemRestaurantId = itemToAdd.restaurant_id;

      if (Object.keys(cartItems).length === 0) {
        setCartItems({ [itemId]: 1 });
        setCartRestaurant(itemRestaurantId);
      } else if (itemRestaurantId === cartRestaurant) {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
      } else {
        setPendingItem(itemId);
        setShowRestaurantPrompt(true);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const clearCartAndAddToCart = () => {
    try {
      if (!pendingItem) return;
      const itemToAdd = food_list.find((product) => product._id === pendingItem);
      if (!itemToAdd) return;
      setCartItems({ [pendingItem]: 1 });
      setCartRestaurant(itemToAdd.restaurant_id);
      setShowRestaurantPrompt(false);
      setPendingItem(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const removeFromCart = (itemId) => {
    try {
      setCartItems((prev) => {
        const newCartItems = { ...prev };
        if (newCartItems[itemId] > 1) {
          newCartItems[itemId] -= 1;
        } else {
          delete newCartItems[itemId];
          if (Object.keys(newCartItems).length === 0) {
            setCartRestaurant(null);
          }
        }
        return newCartItems;
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const getTotalCartAmount = () => {
    try {
      let totalAmount = 0;
      for (const item in cartItems) {
        if (cartItems[item] > 0) {
          let itemInfo = food_list.find((product) => product._id === item);
          if (itemInfo) {
            totalAmount += itemInfo.price * cartItems[item];
          }
        }
      }
      return totalAmount;
    } catch (error) {
      console.error("Error calculating cart total:", error);
      return 0;
    }
  };

  // Wishlist functions
  const addToWishlist = (itemId) => {
    try {
      if (!wishlistItems.includes(itemId)) {
        setWishlistItems((prev) => [...prev, itemId]);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = (itemId) => {
    try {
      setWishlistItems((prev) => prev.filter((id) => id !== itemId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // Order functions
  const placeNewOrder = (orderData) => {
    try {
      const newOrder = {
        ...orderData,
        id: `ORDER${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        status: "Preparing",
      };
      setOrders((prev) => [...prev, newOrder]);
      setCartItems({});
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");

    setToken("");
    setUserName("");
    setUserRole("customer");
    setCartItems({});
    setWishlistItems([]);
    setSavedAddresses([]);
  };


  // Effects
  useEffect(() => {
    const loadInitialData = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) setToken(storedToken);

      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) setUserName(storedUserName);

      const storedRole = localStorage.getItem("role");
      if (storedRole) setUserRole(storedRole);

      await Promise.all([fetchFoodList(), fetchRestaurantList()]);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  // Context value
  const contextValue = {
    url,
    BACKEND_URL,
    food_list,
    restaurant_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    showRestaurantPrompt,
    setShowRestaurantPrompt,
    pendingItem,
    clearCartAndAddToCart,
    cartRestaurant,
    token,
    setToken,
    userName,
    setUserName,
    logout,
    location,
    setLocation,
    searchQuery,
    setSearchQuery,
    addToWishlist,
    removeFromWishlist,
    wishlistItems,
    orders,
    placeNewOrder,
    savedAddresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress, userRole,       
    setUserRole
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;