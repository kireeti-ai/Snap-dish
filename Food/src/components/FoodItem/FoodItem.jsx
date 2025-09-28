import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets.js';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ id, name, price, description, image, is_veg, restaurant_id, rating }) => {
    const {
        cartItems,
        addToCart,
        removeFromCart,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        BACKEND_URL 
    } = useContext(StoreContext);

    const isWishlisted = wishlistItems.includes(id);

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img
                    className='wishlist-icon'
                    onClick={() => isWishlisted ? removeFromWishlist(id) : addToWishlist(id)}
                    src={isWishlisted ? assets.heart_solid : assets.heart_outline}
                    alt="Add to wishlist"
                />
                <img
                    className="food-item-image"
                    src={image}
                    alt={name}
                    onError={(e) => { e.target.src = '/placeholder-food.jpg'; }}
                />
                {!cartItems[id]
                    ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add to cart" />
                    : <div className='food-item-counter'>
                        <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="Remove from cart" />
                        <p>{cartItems[id]}</p>
                        <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="Add more" />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p className="food-item-name">{name}</p>
                    <div className="item-rating">
                        {rating && <span>⭐ {rating}</span>}
                    </div>
                </div>

                <div className="food-item-type">
                    <div className={`veg-indicator ${is_veg ? 'veg' : 'non-veg'}`}>
                        <div className={`dot ${is_veg ? 'green' : 'red'}`}></div>
                    </div>
                    <span className="veg-label">{is_veg ? 'Veg' : 'Non-Veg'}</span>
                </div>

                <p className='food-item-desc'>{description}</p>
                <p className='food-item-price'>₹{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;