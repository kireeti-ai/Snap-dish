import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './RestaurantDetail.css';
import { assets } from '../../assets/assets';
import FoodItem from '../../components/FoodItem/FoodItem';
import Reviews from '../../components/Reviews/Reviews';
import { motion, AnimatePresence } from 'framer-motion';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { restaurant_list, food_list } = useContext(StoreContext);
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantMenu, setRestaurantMenu] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    const foundRestaurant = restaurant_list.find(r => r._id === id);
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
      
      // Corrected line: Filter food list by restaurant's unique ID
// This is the new, correct line
const filteredFood = food_list.filter(food => food.restaurant_id?._id === foundRestaurant._id);      
      const categorizedMenu = filteredFood.reduce((acc, food) => {
        if (!acc[food.category]) {
          acc[food.category] = [];
        }
        acc[food.category].push(food);
        return acc;
      }, {});
      
      setRestaurantMenu(categorizedMenu);
      setReviews(foundRestaurant.reviews || {});
      
      const initialState = {};
      Object.keys(categorizedMenu).forEach(cat => { initialState[cat] = true; });
      setOpenCategories(initialState);
    }
  }, [id, restaurant_list, food_list]);

  if (!restaurant) {
    return (
      <div className="loading-state">
        <img src={assets.loading} alt="Loading" />
        Loading restaurant details...
      </div>
    );
  }
  
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="restaurant-detail-page">
      <motion.div
        className="restaurant-detail-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="restaurant-name">{restaurant.name}</h1>
        <div className="restaurant-meta-info">
          <p className="rating-info">
            <img src={assets.star} alt="star" className="icon" /> {restaurant.rating} ({restaurant.people}k+ ratings)
          </p>
          <p className="price-for-two">Price For Two :  ₹{restaurant.price_for_two}</p>
        </div>
        <p className="cuisine">{restaurant.cuisine}</p>
        <div className="location-time">
          <p>📍{restaurant.address}</p>
          <p><img src={assets.time} alt="time" className="icon" /> {restaurant.timing || restaurant.time}</p>
        </div>
        <div className="offer-banner">
          <img src={assets.offer} alt="offer" className="icon" /> Free delivery on orders above ₹199
        </div>
      </motion.div>

      <hr className="separator" />

      <div className="menu-search-filter">
        <h3 className="menu-heading"> MENU</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for dishes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img src={assets.search_icon} alt="search" className="search-icon" />
        </div>
        <div className="filter-options">
          <button
            className={`filter-button ${vegOnly ? 'active' : ''}`}
            onClick={() => setVegOnly(!vegOnly)}
          >
            Pure Veg
          </button>
          <button className="filter-button">Bestseller</button>
        </div>
      </div>

      <hr className="separator" />

      <div className="full-menu-section">
        {Object.keys(restaurantMenu).map(category => {
          const filteredItems = restaurantMenu[category].filter(food => {
            const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesVeg = !vegOnly || food.is_veg === true;
            return matchesSearch && matchesVeg;
          });

          if (filteredItems.length === 0) return null;

          return (
            <div key={category} className="menu-category">
              <div className="category-header" onClick={() => toggleCategory(category)}>
                <h3>{category} ({filteredItems.length})</h3>
                <motion.span
                  className="dropdown-arrow"
                  animate={{ rotate: openCategories[category] ? 0 : -90 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </div>
              <AnimatePresence>
                {openCategories[category] && (
                  <motion.div
                    className="category-items"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {filteredItems.map((food, i) => (
                      <motion.div
                        key={food._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <FoodItem
                          id={food._id}
                          name={food.name}
                          price={food.price}
                          description={food.description}
                          image={food.image}
                          is_veg={food.is_veg}
                          rating={food.rating} 
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <hr className="separator" />
      <Reviews reviews={reviews} />
    </div>
  );
};

export default RestaurantDetail;