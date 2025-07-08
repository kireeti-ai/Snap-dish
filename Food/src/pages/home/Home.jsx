// src/pages/home/Home.jsx
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
// Import the RestaurantDisplay component
import RestaurantDisplay from '../../components/RestaurantDisplay/RestaurantDisplay';

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setcategory={setCategory} />
      <FoodDisplay category={category} />
      {/* Add the RestaurantDisplay component here to render it on the page */}
      <RestaurantDisplay />
    </div>
  );
};

export default Home;