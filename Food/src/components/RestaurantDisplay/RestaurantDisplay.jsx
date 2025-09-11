import React, { useContext } from "react"
import "./RestaurantDisplay.css"
import { RestaurantContext } from "../../Context/RestaurantContext.jsx"
import RestaurantItem from "../RestaurantItem/RestaurantItem"
import { motion } from "framer-motion"

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
  const { restaurant_list } = useContext(RestaurantContext)

  return (
    <div className="restaurant-display">
      <h2>Top Restaurant Near You</h2>
      <motion.div
        className="restaurant-list"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {restaurant_list.map((item, index) => (
          <motion.div key={item._id} variants={itemVariants}>
            <RestaurantItem
              id={item._id}
              name={item.name}
              cuisine={item.cuisine}
              rating={item.rating}
              time={item.time}
              image={item.image}
              price_for_two={item.price_for_two}
              people={item.people}
              address={item.address}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default RestaurantDisplay