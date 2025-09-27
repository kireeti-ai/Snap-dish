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
  
  // Backend URL configuration - safe for all environments
  const BACKEND_URL = "https://snap-dish.onrender.com";
  const url = BACKEND_URL;
  
  // Auth state (using in-memory storage instead of localStorage)
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  
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

  // API functions
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/menuItem/list`);
      if (response.data.success) {
        setFoodList(response.data.data || []);
      } else {
        console.error("Failed to fetch food list:", response.data.message);
        setFoodList([]);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      setFoodList([]);
      if (toast) {
        toast.error("Error connecting to the server.");
      }
    }
  };

  const fetchRestaurantList = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurant`);
      if (response.data.success) {
        // Sort by rating (highest first) for homepage display
        const sortedRestaurants = (response.data.data || []).sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setRestaurantList(sortedRestaurants);
      } else {
        console.error("Failed to fetch restaurant list:", response.data.message);
        setRestaurantList([]);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurantList([]);
      if (toast) {
        toast.error("Error connecting to the server.");
      }
    }
  };

  // Address API functions
  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSavedAddresses(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      if (toast) {
        toast.error("Failed to load addresses");
      }
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

  // Auth functions
  const logout = () => {
    try {
      setToken("");
      setUserName("");
      setCartItems({});
      setWishlistItems([]);
      setSavedAddresses([]);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Effects
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([fetchFoodList(), fetchRestaurantList()]);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    
    initializeData();
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
    setDefaultAddress,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;