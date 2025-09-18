import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const url = "http://localhost:4000"; // Backend server URL
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [showRestaurantPrompt, setShowRestaurantPrompt] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]); 

  const [location, setLocation] = useState({
    address: "Ettimadai, Coimbatore",
    latitude: 10.8817,
    longitude: 76.9038,
  });

  // ---------------- FOOD LIST ----------------
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

  // ---------------- ADDRESS API ----------------
  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSavedAddresses(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load addresses");
    }
  };

  const addAddress = async (addressData) => {
    try {
      const res = await axios.post(`${url}/api/address`, addressData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSavedAddresses((prev) => [...prev, res.data.data]);
        toast.success("Address added");
      }
    } catch (error) {
      toast.error("Failed to add address");
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
        toast.success("Address updated");
      }
    } catch (error) {
      toast.error("Failed to update address");
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await axios.delete(`${url}/api/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSavedAddresses((prev) => prev.filter((addr) => addr._id !== id));
        toast.success("Address deleted");
      }
    } catch (error) {
      toast.error("Failed to delete address");
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
      toast.error("Failed to set default address");
    }
  };

  // ---------------- CART LOGIC ----------------
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

  // ---------------- WISHLIST ----------------
  const addToWishlist = (itemId) => {
    if (!wishlistItems.includes(itemId)) {
      setWishlistItems((prev) => [...prev, itemId]);
    }
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems((prev) => prev.filter((id) => id !== itemId));
  };

  // ---------------- ORDERS ----------------
  const placeNewOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ORDER${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "Preparing",
    };
    setOrders((prev) => [...prev, newOrder]);
    setCartItems({});
  };

  // ---------------- AUTH ----------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken("");
    setUserName("");
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchFoodList(); 
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      fetchAddresses(); // fetch addresses after login
    }
  }, [token, userName]);

  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [cartItems]);

  // ---------------- CONTEXT VALUE ----------------
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
