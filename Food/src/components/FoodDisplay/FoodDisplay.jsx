
import React, { useContext } from 'react';
import './FoodDisplay.css';

import { CanteenContext } from '../../Context/CanteenContext';

import RestaurantItem from '../RestaurantItem/RestaurantItem.jsx'
const FoodDisplay = ({ category }) => {
    const { canteen_list } = useContext(CanteenContext);

    return (
        <div className='food-display' id='food-display'>
            <h2>Canteens in Amrita</h2>
            <div className="food-display-list">
            {canteen_list.map((item,index)=>{
                return <RestaurantItem key={index} id={item._id} name={item.name} cuisine ={item.cuisine} rating={item.rating} time = {item.time} image={item.image} price_for_two={item.price_for_two}  people ={item.people}address={item.address}/>
            })}
            </div>
        </div>
    );
};

export default FoodDisplay;
