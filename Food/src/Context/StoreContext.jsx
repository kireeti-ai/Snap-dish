import { createContext, useState, useEffect } from "react";
import { food_list} from "../assets/assets";

export const StoreContext = createContext(null);
const initialAddresses = [
  { id: 1, type: 'Home', firstName: "John", lastName: "Doe", street: '123 Palm Grove', city: 'Coimbatore', state: 'Tamil Nadu', zipCode: '641021', country: 'India', phone: '9876543210', email: 'john.doe@example.com', isDefault: true },
  { id: 2, type: 'Work', firstName: "Jane", lastName: "Smith", street: '456 Tech Park Rd', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001', country: 'India', phone: '9123456789', email: 'jane.smith@example.com', isDefault: false },
];

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const url = "https://snap-dish.onrender.com"
  const [token, setToken] = useState();
  const [userName, setUserName] = useState("");
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [showRestaurantPrompt, setShowRestaurantPrompt] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState(initialAddresses);

  const [location, setLocation] = useState({
    address: "Ettimadai, Coimbatore", 
    latitude: 10.8817,               
    longitude: 76.9038,
  });
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
    }
    else if (itemRestaurantId === cartRestaurant) {
      setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    }
    else {
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
    // After placing an order, the cart should be cleared
    setCartItems({}); 
  };
  // ++ ADD ADDRESS MANAGEMENT FUNCTIONS ++
  const addAddress = (addressData) => {
    const newAddress = { 
      ...addressData, 
      id: Date.now(), 
      isDefault: savedAddresses.length === 0 // Make first address the default
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
    // Load token and name from local storage when the app loads
    const storedToken = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUserName) {
      setUserName(storedUserName);
    }
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);
    useEffect(() => {
    // Save cart to local storage whenever it changes
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems"); // Clean up if cart is empty
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
    addToWishlist,removeFromWishlist,wishlistItems,
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