import { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [showRestaurantPrompt, setShowRestaurantPrompt] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

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

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    showRestaurantPrompt,
    setShowRestaurantPrompt,
    pendingItem,
    clearCartAndAddToCart,
    cartRestaurant
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;