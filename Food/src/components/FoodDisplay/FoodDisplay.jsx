// src/components/FoodDisplay/FoodDisplay.jsx
import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext.jsx';
import FoodItem from '../FoodItem/FoodItem';

// The component now accepts `category` as a prop from the Home page.
const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top Dishes Near You</h2>
            <div className="food-display-list">
                {/* We now filter the food_list before mapping.
                  The logic: show the item if the category is "All" OR if the item's category matches the selected category.
                */}
                {food_list.filter(item => category === "All" || item.category === category)
                    .map((item, index) => {
                        return <FoodItem
                            key={index}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            context="main-page" // Pass the context for styling
                        />;
                    })}
            </div>
        </div>
    );
};

export default FoodDisplay;