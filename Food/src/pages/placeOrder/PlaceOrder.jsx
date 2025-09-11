import React, { useContext, useState } from 'react';
import './placeOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PlaceOrder = () => {
  const { getTotalCartAmount, placeNewOrder, cartItems, savedAddresses, food_list, cartRestaurant } = useContext(StoreContext);
  const navigate = useNavigate();

  const [deliveryData, setDeliveryData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipCode: '', country: '', phone: ''
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData(prevData => ({ ...prevData, [name]: value }));
    setSelectedAddressId(null);
  };

  const selectAddress = (address) => {
    setDeliveryData(address);
    setSelectedAddressId(address.id);
  };

  const handleOrderSubmit = (event) => {
    event.preventDefault();

    const orderItems = Object.keys(cartItems).map((itemId) => {
      const itemInfo = food_list.find((product) => product._id === itemId);
      return {
        ...itemInfo,
        quantity: cartItems[itemId]
      };
    }).filter(item => item.name);

    const restaurantName = orderItems.length > 0 
      ? food_list.find(food => food.restaurant_id === cartRestaurant)?.restaurant_name 
      : "Assorted Items";

    const orderDetails = {
      items: orderItems,
      total: getTotalCartAmount() + 50,
      deliveryInfo: deliveryData,
      restaurant: restaurantName,
    };

    placeNewOrder(orderDetails);
    navigate('/orderSuccess');
  };

  return (
    <motion.form 
      className='place-order' 
      onSubmit={handleOrderSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* LEFT SIDE - DELIVERY */}
      <motion.div 
        className="place-order-left"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {savedAddresses && savedAddresses.length > 0 && (
          <div className="saved-addresses">
            <p className="title">Select a Saved Address</p>
            <div className="address-card-list">
              {savedAddresses.map(address => (
                <motion.div 
                  key={address.id} 
                  className={`address-card ${selectedAddressId === address.id ? 'selected' : ''}`}
                  onClick={() => selectAddress(address)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <p className="card-name">{address.firstName} {address.lastName}</p>
                  <p>{address.street}, {address.city}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <p className="title">Or Enter New Delivery Information</p>
        <motion.div 
          className="multi-fields"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input type="text" name="firstName" placeholder='First name' value={deliveryData.firstName} onChange={handleInputChange} required />
          <input type="text" name="lastName" placeholder='Last name' value={deliveryData.lastName} onChange={handleInputChange} required />
        </motion.div>
        <input type="email" name="email" placeholder='Email address' value={deliveryData.email} onChange={handleInputChange} required />
        <input type="text" name="street" placeholder='Street' value={deliveryData.street} onChange={handleInputChange} required />
        <div className="multi-fields">
          <input type="text" name="city" placeholder='City' value={deliveryData.city} onChange={handleInputChange} required />
          <input type="text" name="state" placeholder='State' value={deliveryData.state} onChange={handleInputChange} required />
        </div>
        <div className="multi-fields">
          <input type="text" name="zipCode" placeholder='Zip code' value={deliveryData.zipCode} onChange={handleInputChange} required />
          <input type="text" name="country" placeholder='Country' value={deliveryData.country} onChange={handleInputChange} required />
        </div>
        <input type="text" name="phone" placeholder='Phone' value={deliveryData.phone} onChange={handleInputChange} required />
      </motion.div>

      {/* RIGHT SIDE - CART */}
      <motion.div 
        className="place-order-right"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.div 
          className="cart-total"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>₹{getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}</b></div>
          </div>
          <motion.button 
            type='submit'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            PROCEED TO PAYMENT
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
};

export default PlaceOrder;