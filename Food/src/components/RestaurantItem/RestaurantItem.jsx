import React from 'react';
import './RestaurantItem.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const RestaurantItem = ({ id, name, cuisine, rating, time, image, address, people, price_for_two }) => {
  return (
    <Link to={`/restaurant/${id}`} className='restaurant-box-link'>
      <div className='restaurant-box'>
        <div className="restaurant-img-box">
          <img className='restaurant-img' src={image} alt={name} />
        </div>
        <div className="restaurant-info">
          <div className="restaurant-name-rate">
            <p>{name}</p>
            <p><img src={assets.star} alt="star icon" />{rating}&nbsp;&nbsp; •&nbsp;&nbsp;<img src={assets.time} alt="time icon" />{time}s</p>
            <p>{cuisine}</p>
            <p>{address}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantItem;