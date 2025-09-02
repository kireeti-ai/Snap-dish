import React, { useContext } from 'react';
import './WishList.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';

const Wishlist = () => {
  const { food_list, wishlistItems } = useContext(StoreContext);

  // Filter the main food list to get only the items that are in the wishlist
  const wishlistedFoods = food_list.filter(item => wishlistItems.includes(item._id));

  return (
    <div className='wishlist'>
      <div className="wishlist-content">
        <h2>My Wishlist</h2>
        <div className="wishlist-items">
          {wishlistedFoods.length > 0 ? (
            wishlistedFoods.map((item, index) => (
              <FoodItem 
                key={index} 
                id={item._id}
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image}
              />
            ))
          ) : (
            <p className="wishlist-empty">Your wishlist is empty. Add some of your favorite foods!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;