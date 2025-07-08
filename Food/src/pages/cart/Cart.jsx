import React, { useContext } from 'react'
import './cart.css'
import { StoreContext } from '../../Context/StoreContext'

const Cart = () => {
  // Destructure getTotalCartAmount along with other context values
  const { cartItems, food_list, removeFromCart, getTotalCartAmount } = useContext(StoreContext);

  // Calculate subTotal using the function from context
  const subTotal = getTotalCartAmount();
  // Example delivery fee: 2, only if subTotal is greater than 0
  const deliveryFee = subTotal > 0 ? 2 : 0;
  // Calculate final total amount
  const totalAmount = subTotal + deliveryFee;

  return (
    <div className='cart'>
      {/* LEFT SIDE: Cart Items List */}
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
           {/* Map through food_list to display items in cart */}
           {food_list.map((item) => {
            if(cartItems[item._id] > 0)
            {
              return(
                <div key={item._id}> {/* Added key to the outer div for mapping */}
                  <div className='cart-items-item'>
                    <img src={item.image} alt={item.name}/> {/* Added alt prop for accessibility */}
                    <p>{item.name}</p>
                    <p>₹ {item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>₹ {item.price * cartItems[item._id]}</p>
                    {/* Added className="cro" and onClick for remove functionality */}
                    <p onClick={() => removeFromCart(item._id)} className="cro">x</p>
                  </div>
                  <hr/> {/* Horizontal rule after each item */}
                </div>
              )
            }
            return null; // Important: Return null if the item is not in the cart
          })}
          {/* Display message if cart is empty */}
          {subTotal === 0 && <p className="cart-items-empty">Your cart is empty. Add some delicious food!</p>}
      </div>

      {/* RIGHT SIDE: Cart Total and Promo Code - THIS SECTION WAS MISSING */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="total-detail">
              <p>Sub Total</p>
              <p>₹ {subTotal}</p> {/* Display calculated subTotal */}
            </div>
            <hr/>
            <div className="total-detail">
              <p>Delivery Fee</p>
              <p>₹ {deliveryFee}</p> {/* Display calculated deliveryFee */}
            </div>
            <hr/>
            <div className="total-detail">
              <b>Total</b>
              <b>₹ {totalAmount}</b> {/* Display calculated totalAmount */}
            </div>
          </div>
          <button>Proceed to Checkout</button>
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