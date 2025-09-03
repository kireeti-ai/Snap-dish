import React, { useContext, useState } from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import LocationModal from "../LocationModel/LocationModel";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const { token, userName, logout, location, setSearchQuery } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {showLocationModal && <LocationModal setShowLocationModal={setShowLocationModal} />}

      <div className="navbar">
        <div className="navbar-left">
          <Link to='/'>
            <img src={assets.logo} alt="Logo" className="logo" />
          </Link>
          <div className="navbar-location" onClick={() => setShowLocationModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="purple" viewBox="0 0 24 24">
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
            </svg>
            <div className="location-text">
              <span className="location-home">DELIVERING TO</span>
              <span className="location-address">
                {location.address.length > 30 
                    ? location.address.substring(0, 27) + "..." 
                    : location.address
                }
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
            <Link to="#food-display" onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>
              Restaurants
            </Link>
          </li>
        </ul>

    
        <div className="navbar-right">
          <div className="navbar-search">
            <Link to="/search">
                        <img src={assets.search_icon} alt="Search" />
                        <div className="in">
                          
                        </div>

            </Link>

          </div>
          <div className="navbar-cart-icon">
            <Link to='/cart'>
              <img src={assets.basket_icon} alt="Cart" />

              <div className="dot"></div>
            </Link>
          </div>
          <div className="favorites">
            <Link to='wishList'>
            <img src={assets.save} alt="Wish List" />
            </Link>
            
          </div>

          {!token ? (
            <button onClick={() => setShowLogin(true)}>Sign In</button>
          ) : (
            <div className="navbar-profile">
              <img src={assets.user} alt="User" className="user-icon"/>
              <ul className="navbar-profile-dropdown">
                <li className="dropdown-user-info">
                  <p>Hi, {userName}</p>
                </li>
                <hr />
                <Link to="/myOrders">
                                <li>
                  {assets.bag_icon && <img src={assets.bag_icon} alt="Orders" />}
                  <p>Orders</p>
                </li>
                </Link>

                <Link to='/partner-with-us'>
                                <li>
                    {assets.agent && <img src={assets.agent} alt="agents" />}
                  <p>Partner with us</p>
                </li>
                </Link>

                <Link to='/address'>
                                <li>
                  {assets.ping && <img src={assets.ping} alt="address" />}
                  <p>Saved Address</p>
                </li>
                
                </Link>

                <hr />
                <li onClick={handleLogout}>
                  {assets.logout_icon && <img src={assets.logout_icon} alt="Logout" />}
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;