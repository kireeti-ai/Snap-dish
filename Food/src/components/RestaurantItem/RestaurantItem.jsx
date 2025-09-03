import React from 'react';
import './RestaurantItem.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const RestaurantItem = ({ id, name, cuisine, rating, time, image, address, price_for_two }) => {
  return (
    <Link to={`/restaurant/${id}`} className="restaurant-box-link">
      <div className="restaurant-box">
        <div className="restaurant-img-box">
          <img className="restaurant-img" src={image} alt={name} />
        </div>
        <div className="restaurant-info">
          <div className="restaurant-name-rate">

            <p>{name}</p>

      
            <p>
              {rating && (
                <>
                  <img src={assets.star} alt="star" style={{ width: '14px', height: '14px', verticalAlign: 'middle' }} /> {rating}
                </>
              )}
              {time && (
                <>
                  &nbsp; • &nbsp;
                  <img src={assets.time} alt="time" style={{ width: '14px', height: '14px', verticalAlign: 'middle' }} /> {time} 
                </>
              )}
            </p>


            {cuisine && <p>{cuisine}</p>}

      
            {address && <p>{address}</p>}


            {price_for_two && <p>₹{price_for_two} for two</p>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantItem;
