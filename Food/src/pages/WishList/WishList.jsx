import React, { useContext } from 'react';
import './WishList.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const { food_list, wishlistItems } = useContext(StoreContext);

  // Filter the main food list to get only the items that are in the wishlist
  const wishlistedFoods = food_list.filter(item => wishlistItems.includes(item._id));

  return (
    <div className='wishlist'>
      <div className="wishlist-content">
        <h2>My Wishlist</h2>
        <div className="wishlist-items">
          <AnimatePresence>
            {wishlistedFoods.length > 0 ? (
              wishlistedFoods.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
                >
                  <FoodItem 
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    description={item.description}
                    image={item.image}
                  />
                </motion.div>
              ))
            ) : (
              <motion.p 
                className="wishlist-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Your wishlist is empty. Add some of your favorite foods!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;