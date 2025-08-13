import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets.js';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ id, name, price, description, image, context }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

    const itemClassName = `food-item food-item-${context}`;

    return (
        <div className={itemClassName}>
            <div className="food-item-img-container">
                <img alt="" className="food-item-image" src={image} />
                {!cartItems[id] ?
                    <img
                        className='add'
                        onClick={() => addToCart(id)}
                        src={assets.add_icon_white}
                        alt="Add to cart"
                    />
                    :
                    <div className='food-item-counter'>
                        <img
                            src={assets.remove_icon_red}
                            onClick={() => removeFromCart(id)}
                            alt="Remove from cart"
                        />
                        <p>{cartItems[id]}</p>
                        <img
                            src={assets.add_icon_green}
                            onClick={() => addToCart(id)}
                            alt="Add more"
                        />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt='Rating' />
                </div>
                <p className='food-item-price'>₹{price}</p>
                <p className='food-item-disc'>
                    {description}
                </p>
            </div>
        </div>
    );
};

export default FoodItem;