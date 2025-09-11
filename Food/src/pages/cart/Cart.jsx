import React, { useContext } from 'react';
import './cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const subTotal = getTotalCartAmount();
  const deliveryFee = subTotal > 0 ? 50 : 0;
  const totalAmount = subTotal + deliveryFee;

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };

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

        <AnimatePresence>
          {food_list.map((item) => {
            if(cartItems[item._id] > 0) {
              return (
                <motion.div 
                  key={item._id}
                  className='cart-items-item-wrapper'
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={itemVariants}
                  transition={{ duration: 0.3 }}
                >
                  <div className='cart-items-item'>
                    <img src={item.image} alt={item.name}/>
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>₹{item.price * cartItems[item._id]}</p>
                    <motion.p 
                      onClick={() => removeFromCart(item._id)} 
                      className="cross"
                      whileTap={{ scale: 1.3, rotate: 90, color: '#ff4d4f' }}
                    >
                      x
                    </motion.p>
                  </div>
                  <hr/>
                </motion.div>
              )
            }
            return null;
          })}
        </AnimatePresence>

        {totalAmount === 0 && 
          <motion.p 
            className="cart-empty-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Your cart is empty. Add some items to get started!
          </motion.p>
        }
      </div>

      <motion.div 
        className="cart-bottom"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="cart-total"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
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
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalAmount}</b>
            </div>
          </div>

          <motion.button 
            onClick={() => navigate('/order')}
            disabled={totalAmount === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            PROCEED TO CHECKOUT
          </motion.button>
        </motion.div>

        <div className="cart-promocode">
          <div>
            <p>If you have a coupon code, enter it here</p>
            <div className="cart-promo-input">
              <input type='text' placeholder='PROMO CODE'/>
              <button>Submit</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Cart;