
import React, { useState } from 'react';
import Header from '../../components/Header/Header';

import RestaurantDisplay from '../../components/RestaurantDisplay/RestaurantDisplay';

import './Home.css'
const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
     
      {/* <FoodDisplay category={category} /> */}
      
      <RestaurantDisplay />
      
    </div>
  );
};

export default Home;