import React, { useContext } from "react"
import "./RestaurantDisplay.css"
import RestaurantItem from "../RestaurantItem/RestaurantItem"
import { motion } from "framer-motion"
import { StoreContext } from "../../Context/StoreContext" // Fixed import

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // each child animates one after another
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
    },
  },
}

const RestaurantDisplay = () => {
  // Fixed: Using StoreContext instead of RestaurantContext
  const { restaurant_list=[] } = useContext(StoreContext)

  // Display top rated restaurants (limited to first 8 for homepage)
  const topRestaurants = restaurant_list.slice(0, 8);

  return (
    <div className="restaurant-display">
      <h2>Top Restaurant Near You</h2>
      <motion.div
        className="restaurant-list"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {topRestaurants.map((item, index) => (
          <motion.div key={item._id} variants={itemVariants}>
            <RestaurantItem
              id={item._id}
              name={item.name}
              cuisine={item.cuisine}
              rating={item.rating}
              time={item.timing || item.time} // Handle both timing and time fields
              image={item.image}
              price_for_two={item.price_for_two}
              people={item.people}
              address={item.address}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {restaurant_list.length === 0 && (
        <p className="no-restaurants">No restaurants available at the moment.</p>
      )}
    </div>
  )
}

export default RestaurantDisplay