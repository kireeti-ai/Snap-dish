// src/Context/StoreContext.jsx
import { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  // New state to track the restaurant ID of items currently in the cart
  const [cartRestaurant, setCartRestaurant] = useState(null);
  // New state to control the visibility of our confirmation prompt
  const [showRestaurantPrompt, setShowRestaurantPrompt] = useState(false);
  // New state to temporarily hold the item that caused the conflict
  const [pendingItem, setPendingItem] = useState(null);

  const addToCart = (itemId) => {
    const itemToAdd = food_list.find((product) => product._id === itemId);
    if (!itemToAdd) return; // Exit if item not found

    const itemRestaurantId = itemToAdd.restaurant_id;

    // Case 1: The cart is empty.
    if (Object.keys(cartItems).length === 0) {
      setCartItems({ [itemId]: 1 });
      setCartRestaurant(itemRestaurantId);
    } 
    // Case 2: The item is from the same restaurant as the other items in the cart.
    else if (itemRestaurantId === cartRestaurant) {
      setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    } 
    // Case 3: The item is from a DIFFERENT restaurant.
    else {
      // Store the item and show the confirmation prompt.
      setPendingItem(itemId);
      setShowRestaurantPrompt(true);
    }
  };

  // New function to handle the user's confirmation.
  // It will clear the old cart and add the new item.
  const clearCartAndAddToCart = () => {
    if (!pendingItem) return;

    const itemToAdd = food_list.find((product) => product._id === pendingItem);
    if (!itemToAdd) return;

    // Clear the cart, add the new item, and set the new restaurant ID.
    setCartItems({ [pendingItem]: 1 });
    setCartRestaurant(itemToAdd.restaurant_id);

    // Hide the prompt and clear the pending item.
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
        // If the cart is now empty, reset the restaurant tracker.
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
    // Add all our new state and functions to the context
    showRestaurantPrompt,
    setShowRestaurantPrompt,
    pendingItem,
    clearCartAndAddToCart,
    cartRestaurant // Good to have for debugging or future features
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
