import React, { useContext } from 'react';
import './RestaurantItem.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const RestaurantItem = ({ id, name, cuisine, rating, time, image, address, price_for_two, people }) => {
  const { BACKEND_URL } = useContext(StoreContext);


  return (
    <Link to={`/restaurant/${id}`} className="restaurant-box-link">
      <div className="restaurant-box">
        <div className="restaurant-img-box">
          <img
            className="restaurant-img"
            src={image} alt={name}
            onError={(e) => {
              e.target.src = '/placeholder-restaurant.jpg';
            }}
          />
        </div>
        <div className="restaurant-info">
          <div className="restaurant-name-rate">
            <h3 className="restaurant-name">{name}</h3>

            <div className="restaurant-rating-time">
              {rating && (
                <div className="rating-section">
                  <img
                    src={assets.star}
                    alt="star"
                    className="rating-icon"
                  />
                  <span className="rating-value">{rating}</span>
                  {people && <span className="people-count">({people}k+)</span>}
                </div>
              )}

              {time && (
                <div className="timing-section">
                  <span className="bullet">•</span>
                  <img
                    src={assets.time}
                    alt="time"
                    className="time-icon"
                  />
                  <span className="timing-value">{time}</span>
                </div>
              )}
            </div>

            {cuisine && <p className="cuisine-type">{cuisine}</p>}
            {address && <p className="restaurant-address">{address}</p>}
            {price_for_two && (
              <p className="price-for-two">₹{price_for_two} for two</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantItem;