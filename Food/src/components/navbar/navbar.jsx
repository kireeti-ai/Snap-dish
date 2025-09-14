import React, { useContext, useState } from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import LocationModal from "../LocationModel/LocationModel";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { token, userName, logout, location } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {showLocationModal && <LocationModal setShowLocationModal={setShowLocationModal} />}

      <motion.div
        className="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        <div className="navbar-left">
          <Link to='/'>
            <motion.img 
              src={assets.logo} 
              alt="Logo" 
              className="logo" 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            />
          </Link>

          <div className="navbar-location" onClick={() => setShowLocationModal(true)}>
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" height="18" fill="purple" viewBox="0 0 24 24"
              whileHover={{ scale: 1.2 }}
            >
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
            </motion.svg>
            <div className="location-text">
              <span className="location-home">DELIVERING TO</span>
              <span className="location-address">
                {location.address.length > 30 
                  ? location.address.substring(0, 27) + "..." 
                  : location.address}
              </span>
            </div>
            <span className="location-arrow">⌄</span>
          </div>
        </div>

        <ul className="navbar-menu">
          <li>
            <Link to="/" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/restaurant">Restaurants</Link>
          </li>
        </ul>

        <div className="navbar-right">
          <motion.div className="navbar-search" whileHover={{ scale: 1.1 }}>
            <Link to="/search">
              <img src={assets.search_icon} alt="Search" />
            </Link>
          </motion.div>

          <motion.div className="navbar-cart-icon" whileHover={{ scale: 1.1 }}>
            <Link to='/cart'>
              <img src={assets.basket_icon} alt="Cart" />
              <div className="dot"></div>
            </Link>
          </motion.div>

          <motion.div className="favorites" whileHover={{ scale: 1.1 }}>
            <Link to='wishList'>
              <img src={assets.save} alt="Wish List" />
            </Link>
          </motion.div>

          {!token ? (
            <motion.button 
              onClick={() => setShowLogin(true)} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          ) : (
            <div 
              className="navbar-profile" 
              onMouseEnter={() => setShowDropdown(true)} 
              onMouseLeave={() => setShowDropdown(false)}
            >
              <img src={assets.user} alt="User" className="user-icon"/>
              
              <AnimatePresence>
                {showDropdown && (
                  <motion.ul 
                    className="navbar-profile-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to="/profile-edit"><li className="dropdown-user-info"><p>Hi, {userName}</p></li></Link>
                    <hr />
                    <Link to="/myOrders"><li><img src={assets.bag_icon} alt="Orders" /><p>Orders</p></li></Link>
                    <Link to="/partner-with-us"><li><img src={assets.agent} alt="agents" /><p>Partner with us</p></li></Link>
                    <Link to="/address"><li><img src={assets.ping} alt="address" /><p>Saved Address</p></li></Link>
                    <Link to="/reviews-user"><li><img src={assets.review} alt="reviews" /><p>My Reviews</p></li></Link>

                    <hr />
                    <li onClick={handleLogout}><img src={assets.logout_icon} alt="Logout" /><p>Logout</p></li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;