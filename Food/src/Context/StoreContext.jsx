import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]); // State for food list from API
  const [searchQuery, setSearchQuery] = useState("");
  const url = "http://localhost:4000";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [showRestaurantPrompt, setShowRestaurantPrompt] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]); // Start with empty array

  const [location, setLocation] = useState({
    address: "Ettimadai, Coimbatore",
    latitude: 10.8817,
    longitude: 76.9038,
  });

  // --- API Calls ---

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        toast.error("Failed to fetch food list.");
      }
    } catch (error) {
      toast.error("Error connecting to the server.");
    }
  };

  // --- End API Calls ---

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken("");
    setUserName("");
  };

  const addToCart = (itemId) => {
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
  };

  const clearCartAndAddToCart = () => {
    if (!pendingItem) return;
    const itemToAdd = food_list.find((product) => product._id === pendingItem);
    if (!itemToAdd) return;
    setCartItems({ [pendingItem]: 1 });
    setCartRestaurant(itemToAdd.restaurant_id);
    setShowRestaurantPrompt(false);
    setPendingItem(null);
  };

  const removeFromCart = (itemId) => {
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
  };

  const getTotalCartAmount = () => {
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
  };

  const addToWishlist = (itemId) => {
    if (!wishlistItems.includes(itemId)) {
      setWishlistItems((prev) => [...prev, itemId]);
    }
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems((prev) => prev.filter((id) => id !== itemId));
  };

  const placeNewOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ORDER${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Preparing'
    };
    setOrders(prev => [...prev, newOrder]);
    setCartItems({});
  };

  const addAddress = (addressData) => {
    const newAddress = {
      ...addressData,
      id: Date.now(),
      isDefault: savedAddresses.length === 0
    };
    setSavedAddresses(prev => [...prev, newAddress]);
  };

  const updateAddress = (addressData) => {
    setSavedAddresses(prev => prev.map(addr => addr.id === addressData.id ? addressData : addr));
  };

  const deleteAddress = (addressId) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
  };

  const setDefaultAddress = (addressId) => {
    setSavedAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === addressId })));
  };

  useEffect(() => {
    fetchFoodList(); // Fetch food list when the component mounts
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userName", userName);
        // Here you would also fetch user-specific data like cart, addresses, etc.
    }
  }, [token, userName]);

  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [cartItems]);

  const contextValue = {
    url,
    food_list,
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