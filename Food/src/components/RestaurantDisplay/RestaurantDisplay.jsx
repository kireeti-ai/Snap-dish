import React, { useContext } from 'react'
import './RestaurantDisplay.css' 
import {RestaurantContext} from  '../../Context/RestaurantContext.jsx'
import RestaurantItem from '../RestaurantItem/RestaurantItem'

const RestaurantDisplay = () => {
    const {restaurant_list} = useContext(RestaurantContext);
  return (
    <div className='restaurant-display'>
        <h2>Top Restaurant Near You</h2>
        <div className="restaurant-list">
            {restaurant_list.map((item,index)=>{
                return <RestaurantItem key={index} id={item._id} name={item.name} cuisine ={item.cuisine} rating={item.rating} time = {item.time} image={item.image} price_for_two={item.price_for_two}  people ={item.people}address={item.address}/>
            })}
        </div>
    </div>
  )
}

export default RestaurantDisplay