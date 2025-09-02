import React, { useContext, useState } from 'react';
import './placeOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  // 1. Get food_list, cartRestaurant, and other necessary items from context
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

    // 2. Create a detailed list of items from the cart using food_list
    const orderItems = Object.keys(cartItems).map((itemId) => {
      const itemInfo = food_list.find((product) => product._id === itemId);
      return {
        ...itemInfo, // Includes name, price, description, etc.
        quantity: cartItems[itemId]
      };
    }).filter(item => item.name); // Ensure we only add valid items

    // 3. Find the restaurant name from the first item in the cart
    const restaurantName = orderItems.length > 0 
      ? food_list.find(food => food.restaurant_id === cartRestaurant)?.restaurant_name 
      : "Assorted Items";

    // 4. Create the complete orderDetails object
    const orderDetails = {
      items: orderItems,
      total: getTotalCartAmount() + 50, // Assuming static 50 fee
      deliveryInfo: deliveryData,
      restaurant: restaurantName,
    };

    placeNewOrder(orderDetails);
    navigate('/orderSuccess');
  };

  return (
    <form className='place-order' onSubmit={handleOrderSubmit}>
      <div className="place-order-left">
        {savedAddresses && savedAddresses.length > 0 && (
          <div className="saved-addresses">
            <p className="title">Select a Saved Address</p>
            <div className="address-card-list">
              {savedAddresses.map(address => (
                <div 
                  key={address.id} 
                  className={`address-card ${selectedAddressId === address.id ? 'selected' : ''}`}
                  onClick={() => selectAddress(address)}
                >
                  <p className="card-name">{address.firstName} {address.lastName}</p>
                  <p>{address.street}, {address.city}</p>
                </div>
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
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>₹{getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}</b></div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;