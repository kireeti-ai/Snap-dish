import React, { useContext, useState, useEffect } from 'react';
import './placeOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { 
    getTotalCartAmount, 
    placeNewOrder, 
    cartItems, 
    savedAddresses, 
    food_list,
    token 
  } = useContext(StoreContext);
  
  const navigate = useNavigate();

  const [deliveryData, setDeliveryData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipCode: '', country: '', phone: ''
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    if (!token) {
        toast.info("Please log in to place an order.");
        navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData(prevData => ({ ...prevData, [name]: value }));
    setSelectedAddressId(null);
  };

  const selectAddress = (address) => {
    // Handle both old and new field names
    setDeliveryData({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      email: address.email || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || address.zip || '',
      country: address.country || 'India',
      phone: address.phone || address.num || '',
    });
    setSelectedAddressId(address._id);
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();

    const orderItems = Object.keys(cartItems).map((itemId) => {
      const itemInfo = food_list.find((product) => product._id === itemId);
      if (itemInfo) {
        return { name: itemInfo.name, price: itemInfo.price, quantity: cartItems[itemId] };
      }
      return null;
    }).filter(item => item !== null);

    if (orderItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderDetails = {
      items: orderItems,
      total: getTotalCartAmount() + (getTotalCartAmount() > 0 ? 50 : 0),
      deliveryInfo: deliveryData,
    };

    const result = await placeNewOrder(orderDetails);
    if (result && result.success) {
      navigate('/orderSuccess');
    }
  };

  const totalAmount = getTotalCartAmount();
  const deliveryFee = totalAmount > 0 ? 50 : 0;

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
                  key={address._id} 
                  className={`address-card ${selectedAddressId === address._id ? 'selected' : ''}`}
                  onClick={() => selectAddress(address)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <p className="card-type"><strong>{address.type}</strong></p>
                  {(address.firstName || address.lastName) && (
                    <p className="card-name">{address.firstName} {address.lastName}</p>
                  )}
                  <p>{address.street}, {address.city}</p>
                  <p>{address.state} - {address.zipCode || address.zip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <p className="title">Or Enter New Delivery Information</p>
        <div className="multi-fields">
          <input type="text" name="firstName" placeholder='First name' value={deliveryData.firstName} onChange={handleInputChange} required />
          <input type="text" name="lastName" placeholder='Last name' value={deliveryData.lastName} onChange={handleInputChange} required />
        </div>
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
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>₹{totalAmount}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>₹{deliveryFee}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>₹{totalAmount + deliveryFee}</b></div>
          </div>
          <motion.button 
            type='submit'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            PROCEED TO PAYMENT
          </motion.button>
        </div>
      </motion.div>
    </motion.form>
  );
};

export default PlaceOrder;