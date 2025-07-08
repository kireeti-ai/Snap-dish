import React, { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import './RestaurantChangePrompt.css';

const RestaurantChangePrompt = () => {
  const { setShowRestaurantPrompt, clearCartAndAddToCart } = useContext(StoreContext);

  const handleConfirm = () => {
    clearCartAndAddToCart();
  };

  const handleCancel = () => {
    setShowRestaurantPrompt(false);
  };

  return (
    <div className="prompt-overlay">
      <div className="prompt-box">
        <h3>Start New Order?</h3>
        <p>Your cart contains items from another restaurant. Would you like to clear the cart and add this item?</p>
        <div className="prompt-buttons">
          <button className="prompt-cancel-btn" onClick={handleCancel}>No</button>
          <button className="prompt-confirm-btn" onClick={handleConfirm}>Yes, Start New</button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantChangePrompt;
