import React from "react"
import "./Header.css"
import { motion } from "framer-motion"

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.5, duration: 0.6, ease: "easeOut" },
  },
  hover: { scale: 1.05, backgroundColor: "#f0f0f0" },
}

const Header = () => {
  return (
    <div className="header">
      <motion.div
        className="header-contents"
        initial="hidden"
        animate="visible"
        variants={textVariants}
      >
        <motion.h2 variants={textVariants}>
          Order your Favourite food here
        </motion.h2>
        <motion.p variants={textVariants}>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients and culinary expertise. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </motion.p>
        <motion.button variants={buttonVariants} whileHover="hover">
          View Menu
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Header