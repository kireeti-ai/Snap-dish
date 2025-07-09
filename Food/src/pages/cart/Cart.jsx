
import React, { useContext } from 'react';
import './cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom'; 

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate(); 

  const subTotal = getTotalCartAmount();
 
  const deliveryFee = subTotal > 0 ? 50 : 0; 
  const totalAmount = subTotal + deliveryFee;

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
           <p>Items</p>
           <p>Title</p>
           <p>Price</p>
           <p>Quantity</p>
           <p>Total</p>
           <p>Remove</p>
        </div>
        <br/>
        <hr/>
           {food_list.map((item) => {
            if(cartItems[item._id] > 0)
            {
              return(
                <div key={item._id}>
                  <div className='cart-items-item'>
                    <img src={item.image} alt={item.name}/>
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>₹{item.price * cartItems[item._id]}</p>
                    <p onClick={() => removeFromCart(item._id)} className="cross">x</p>
                  </div>
                  <hr/>
                </div>
              )
            }
            return null;
          })}
          {totalAmount === 0 && <p className="cart-empty-message">Your cart is empty. Add some items to get started!</p>}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>₹{subTotal}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalAmount}</b>
            </div>
          </div>

          <button 
            onClick={() => navigate('/order')} 
            disabled={totalAmount === 0}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
           <div>
            <p>If you have a coupon code, enter it here</p>
            <div className="cart-promo-input">
              <input type='text' placeholder='PROMO CODE'/>
              <button>Submit</button>
            </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
