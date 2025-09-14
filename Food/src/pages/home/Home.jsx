
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import RestaurantDisplay from '../../components/RestaurantDisplay/RestaurantDisplay';
import Navbar from '../../components/navbar/navbar';

import './Home.css'
const Home = ({ setShowLogin }) => {
  return (
    <div>
     
      <Header />
      <RestaurantDisplay />
    </div>
  );
};

export default Home;