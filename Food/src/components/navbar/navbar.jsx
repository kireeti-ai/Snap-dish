import React, { useState } from "react";
  import "./navbar.css";
  import { assets } from "../../assets/assets";
  import { Link } from "react-router-dom";
  const Navbar = ({setShowLogin}) => {
    const [menu, setMenu] = useState("Home");

    return (
      <div className="navbar">
        {/* Left Section */}
        <div className="navbar-left">
          <Link to='/'><img src={assets.logo} alt="Logo" className="logo" /></Link>
          <div className="navbar-location">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="purple"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
            </svg>
            <div className="location-text">
              <span className="location-home">HOME</span>
              <span className="location-address">
                SK Nagar, Vk Puram, Tirupati, Andhra Pradesh
              </span>
            </div>
            <span className="location-arrow">⌄</span>
          </div>
        </div>


        <ul className="nav-bar_menu">
          <a href="/"
            onClick={() => setMenu("Home")}
            className={menu === "Home" ? "Active" : ""}
          >
            Home
          </a>
          <a href="#food-display"
            onClick={() => setMenu("Menu")}
            className={menu === "Menu" ? "Active" : ""}
          >
            Menu
          </a>
        </ul>

        {/* Right Icons */}
        <div className="navbar-right">
          <div className="navbar-offers">
            <img src={assets.offer} alt="Offers" />
            <p>Offers</p>
          </div>
          <div className="navbar-icon-label">
            <img src={assets.search_icon} alt="Search" />
            <p>Search</p>
          </div>
          <div className="navbar-search-icon">
            <Link to='/cart'><img src={assets.basket_icon} alt="Cart" /> <div className="dot"></div></Link>
            <p>Cart</p>   {/* Moved "Cart" text directly here for consistency */}
          </div>
          <div className="favorites"> {/* Simplified structure */}
            <img src={assets.save} alt="Wish List" />
            <p>Wish List</p>
          </div>
          <div className="user-box">
            <img src={assets.user} alt="User" />
            <button onClick={()=>setShowLogin(true)}>Sign In</button>
          </div>

        </div>
      </div>
    );
  };

  export default Navbar;