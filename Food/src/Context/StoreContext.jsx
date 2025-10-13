import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import io from "socket.io-client";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // --- STATE MANAGEMENT ---
  const [food_list, setFoodList] = useState([]);
  const [restaurant_list, setRestaurantList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("customer");
  const [orders, setOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [socket, setSocket] = useState(null);

  // --- UI STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [showRestaurantPrompt, setShowRestaurantPrompt] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [location, setLocation] = useState({
    address: "Ettimadai, Coimbatore",
    latitude: 10.8817,
    longitude: 76.9038,
  });

  const url = "http://localhost:4000";

  // --- CORE API FUNCTIONS ---

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/menu/list`);
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching food list:", error);
      toast.error("Error connecting to the server.");
    }
  };

// UPDATE ADDRESS
const updateAddress = async (addressData) => {
  if (!token) return;
  try {
    const res = await axios.put(
      `${url}/api/address/${addressData._id}`, 
      addressData, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) {
      setSavedAddresses((prev) => 
        prev.map(addr => addr._id === addressData._id ? res.data.data : addr)
      );
      toast.success("Address updated");
    }
  } catch (error) {
    toast.error("Failed to update address");
  }
};

// DELETE ADDRESS
const deleteAddress = async (addressId) => {
  if (!token) return;
  try {
    const res = await axios.delete(
      `${url}/api/address/${addressId}`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) {
      setSavedAddresses((prev) => prev.filter(addr => addr._id !== addressId));
      toast.success("Address deleted");
    }
  } catch (error) {
    toast.error("Failed to delete address");
  }
};

// SET DEFAULT ADDRESS
const setDefaultAddress = async (addressId) => {
  if (!token) return;
  try {
    const res = await axios.patch(
      `${url}/api/address/${addressId}/default`, 
      {}, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) {
      setSavedAddresses((prev) => 
        prev.map(addr => ({
          ...addr,
          isDefault: addr._id === addressId
        }))
      );
      toast.success("Default address updated");
    }
  } catch (error) {
    toast.error("Failed to set default address");
  }
};

  const fetchRestaurantList = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurants/list`);
      const sortedRestaurants = (response.data.data || []).sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setRestaurantList(sortedRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("Could not fetch restaurants.");
    }
  };

  // --- PERSISTENT DATA LOGIC (CART & WISHLIST) ---

  const updateCartInDb = async (cartData) => {
    if (token) {
      try {
        await axios.post(`${url}/api/users/cart`, cartData, { headers: { Authorization: `Bearer ${token}` } });
      } catch (error) {
        toast.error("Could not save cart changes.");
      }
    }
  };
  
  const updateWishlistInDb = async (wishlistData) => {
    if (token) {
        try {
            await axios.post(`${url}/api/users/wishlist`, { wishlist: wishlistData }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) {
            toast.error("Could not save wishlist changes.");
        }
    }
  };

  const loadUserData = async (authToken) => {
    try {
        const cartResponse = await axios.get(`${url}/api/users/cart`, { headers: { Authorization: `Bearer ${authToken}` } });
        if (cartResponse.data.success) {
            setCartItems(cartResponse.data.cartData || {});
        }
        const wishlistResponse = await axios.get(`${url}/api/users/wishlist`, { headers: { Authorization: `Bearer ${authToken}` } });
        if (wishlistResponse.data.success) {
            setWishlistItems(wishlistResponse.data.wishlist || []);
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
  };

  const addToCart = async (itemId) => {
    const itemToAdd = food_list.find((p) => p._id === itemId);
    if (!itemToAdd) return;
    const itemRestaurantId = itemToAdd.restaurant_id;

    if (Object.keys(cartItems).length > 0 && itemRestaurantId !== cartRestaurant) {
      setPendingItem(itemId);
      setShowRestaurantPrompt(true);
      return;
    }
    if (Object.keys(cartItems).length === 0) setCartRestaurant(itemRestaurantId);
    
    const newCartItems = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(newCartItems);
    await updateCartInDb(newCartItems);
  };

  const removeFromCart = async (itemId) => {
    const newCartItems = { ...cartItems };
    if (newCartItems[itemId] > 1) newCartItems[itemId] -= 1;
    else delete newCartItems[itemId];
    if (Object.keys(newCartItems).length === 0) setCartRestaurant(null);
    
    setCartItems(newCartItems);
    await updateCartInDb(newCartItems);
  };
  
  const clearCartAndAddToCart = async () => {
    if (!pendingItem) return;
    const itemToAdd = food_list.find((p) => p._id === pendingItem);
    if (!itemToAdd) return;

    const newCartItems = { [pendingItem]: 1 };
    setCartItems(newCartItems);
    setCartRestaurant(itemToAdd.restaurant_id);
    setPendingItem(null);
    setShowRestaurantPrompt(false);
    await updateCartInDb(newCartItems);
  };
  
  const addToWishlist = async (itemId) => {
    const newWishlist = [...wishlistItems];
    if (!newWishlist.includes(itemId)) {
      newWishlist.push(itemId);
      setWishlistItems(newWishlist);
      await updateWishlistInDb(newWishlist);
    }
  };

  const removeFromWishlist = async (itemId) => {
    const newWishlist = wishlistItems.filter((id) => id !== itemId);
    setWishlistItems(newWishlist);
    await updateWishlistInDb(newWishlist);
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const itemInfo = food_list.find((p) => p._id === itemId);
      return total + (itemInfo ? itemInfo.price * quantity : 0);
    }, 0);
  };

  // --- USER SESSION, ORDERS & ADDRESSES ---

  const fetchUserOrders = async (authToken = token) => {
    if (!authToken) return;
    try {
      const response = await axios.get(`${url}/api/order/myorders`, { headers: { Authorization: `Bearer ${authToken}` } });
      if (response.data.success) setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  
  const fetchAddresses = async (authToken = token) => {
    if (!authToken) return;
    try {
      const res = await axios.get(`${url}/api/address`, { headers: { Authorization: `Bearer ${authToken}` } });
      if (res.data.success) setSavedAddresses(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load addresses");
    }
  };

  const addAddress = async (addressData) => {
    if (!token) return;
    try {
      const res = await axios.post(`${url}/api/address`, addressData, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setSavedAddresses((prev) => [...prev, res.data.data]);
        toast.success("Address added");
      }
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  // In StoreContext.jsx

  const placeNewOrder = async (orderData) => {
    if (!token) {
      toast.error("Please log in to place an order.");
      return { success: false };
    }
    try {
      // --- ROBUST FIX STARTS HERE ---
      
      // 1. Get the list of item IDs from the cart
      const cartItemIds = Object.keys(cartItems);
      if (cartItemIds.length === 0) {
          toast.error("Your cart is empty.");
          return { success: false };
      }

      // 2. Find the first item in the food_list to get the restaurantId
      const firstItemInCart = food_list.find(item => item._id === cartItemIds[0]);
      if (!firstItemInCart) {
          toast.error("Could not find restaurant information for the items in your cart.");
          return { success: false };
      }
      const restaurantId = firstItemInCart.restaurant_id;

      // 3. Construct the payload with the derived restaurantId
      const orderPayload = { 
        items: orderData.items, 
        amount: orderData.total, 
        address: orderData.deliveryInfo,
        restaurantId: restaurantId // <-- Use the ID found from the cart items
      };
      
      // --- ROBUST FIX ENDS HERE ---
      
      const response = await axios.post(`${url}/api/order/place`, orderPayload, { headers: { Authorization: `Bearer ${token}` } });
      
      if (response.data.success) {
        setCartItems({});
        setCartRestaurant(null); // Also clear the cart restaurant state
        await updateCartInDb({});
        await fetchUserOrders();
        return { success: true };
      }
      
      toast.error(response.data.message || "Failed to place order.");
      return { success: false };

    } catch (error) {
      toast.error("An error occurred while placing your order.");
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken("");
    setUserName("");
    setUserRole("customer");
    setCartItems({});
    setWishlistItems([]);
    setSavedAddresses([]);
    setOrders([]);
  };
  

  // --- EFFECTS ---
  // --- NEW: WebSocket Connection Effect ---
  useEffect(() => {
    // Establish connection when the component mounts
    const newSocket = io(url); // Use your backend URL
    setSocket(newSocket);

    // Clean up the connection when the component unmounts
    return () => newSocket.close();
  }, []);

  // --- NEW: WebSocket Event Listener Effect ---
  useEffect(() => {
    if (!socket) return; // Don't do anything if the socket is not connected yet

    // Set up the listener for order status updates
    socket.on('orderStatusUpdated', (updatedOrder) => {
      toast.info(`Order #${updatedOrder._id.slice(-6)} is now ${updatedOrder.status}!`);
      
      // Update the orders state with the new data from the server
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    // Clean up the listener to prevent memory leaks
    return () => {
      socket.off('orderStatusUpdated');
    };
  }, [socket]); // This effect re-runs if the socket instance changes

  useEffect(() => {
    async function loadInitialData() {
      await Promise.all([fetchFoodList(), fetchRestaurantList()]);
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadUserData(storedToken);
        await fetchAddresses(storedToken);
        await fetchUserOrders(storedToken);
        setUserName(localStorage.getItem("userName"));
        setUserRole(localStorage.getItem("role"));
      }
    }
    loadInitialData();
  }, []);

  // --- CONTEXT VALUE ---
  const contextValue = {
    food_list, restaurant_list, cartItems, wishlistItems, token, userName, userRole, orders, savedAddresses,
    searchQuery, location, showRestaurantPrompt, pendingItem, cartRestaurant, url,
    setSearchQuery, setLocation, setToken, setUserName, setUserRole, setShowRestaurantPrompt,
    addToCart, removeFromCart, getTotalCartAmount, clearCartAndAddToCart,
    addToWishlist, removeFromWishlist,socket, // <-- Expose the socket instance to other components
    setOrders,
    placeNewOrder, logout, fetchAddresses, addAddress, updateAddress,
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