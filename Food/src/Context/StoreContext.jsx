import { createContext, useState, useEffect } from "react";
import { food_list} from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const url = "https://snap-dish-vcqv.vercel.app"
  const [token, setToken] = useState();
  const [userName, setUserName] = useState("");
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [showRestaurantPrompt, setShowRestaurantPrompt] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
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
  }, []);
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
    location,       // ++ ADD THESE ++
    setLocation,
    searchQuery,      // 2. Pass query to context
    setSearchQuery
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;