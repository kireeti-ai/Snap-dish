import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RestaurantContext } from '../../Context/RestaurantContext';
import { food_list } from '../../assets/assets';
import './RestaurantDetail.css';
import { assets } from '../../assets/assets';
import FoodItem from '../../components/FoodItem/FoodItem';
import Reviews from '../../components/Reviews/Reviews';

const RestaurantDetail = () => {
    const { id } = useParams();
    const { restaurant_list } = useContext(RestaurantContext);
    const [restaurant, setRestaurant] = useState(null);
    const [restaurantMenu, setRestaurantMenu] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [vegOnly, setVegOnly] = useState(false);
    const [reviews, setReviews] = useState([]);


    useEffect(() => {
        const foundRestaurant = restaurant_list.find(r => r._id === id);
        if (foundRestaurant) {
            setRestaurant(foundRestaurant);
            const filteredFood = food_list.filter(food => food.restaurant === foundRestaurant.name);
            const categorizedMenu = filteredFood.reduce((acc, food) => {
                if (!acc[food.category]) {
                    acc[food.category] = [];
                }
                acc[food.category].push(food);
                return acc;
            }, {});
            setRestaurantMenu(categorizedMenu);
            // Mock reviews data for demonstration
            setReviews([
                {
                    reviewerName: 'John Doe',
                    rating: 4,
                    comment: 'Great food, loved the ambiance!'
                },
                {
                    reviewerName: 'Jane Smith',
                    rating: 5,
                    comment: 'Absolutely fantastic! Will visit again.'
                }
            ]);
        }
    }, [id, restaurant_list]);

    if (!restaurant) {
        return <div className="loading-state"><img src={assets.loading} alt="Loading"/>Loading restaurant details... </div>;
    }

    return (
        <div className="restaurant-detail-page">
            <div className="restaurant-detail-header">
                <h1 className="restaurant-name">{restaurant.name}</h1>
                <div className="restaurant-meta-info">
                    <p className="rating-info">
                        <img src={assets.star} alt="star" className="icon" /> {restaurant.rating} ({restaurant.people}k+ ratings)
                    </p>
                    <p className="price-for-two">Price For Two :  ₹{restaurant.price_for_two}</p>
                </div>
                <p className="cuisine">{restaurant.cuisine}</p>
                <div className="location-time">
                    <p>📍{restaurant.address}</p>
                    <p><img src={assets.time} alt="time" className="icon" /> {restaurant.time}</p>
                </div>
                <div className="offer-banner">
                    <img src={assets.offer} alt="offer" className="icon" /> Free delivery on orders above ₹199
                </div>
            </div>
            
            <hr className="separator" />

            <div className="menu-search-filter">
                <h3 className="menu-heading"> MENU</h3>
                <div className="search-bar">
                   
                    <input 
                        type="text" 
                        placeholder="Search for dishes" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={assets.search_icon} alt="search" className="search-icon" />
                </div>
                <div className="filter-options">

                    <button 
                        className={`filter-button ${vegOnly ? 'active' : ''}`}
                        onClick={() => setVegOnly(!vegOnly)}
                    >
                         Pure Veg
                    </button>
                    <button className="filter-button" >Bestseller</button>
                </div>
            </div>

            <hr className="separator" />

            <div className="full-menu-section">
                {Object.keys(restaurantMenu).map(category => {
                
                    const filteredItems = restaurantMenu[category].filter(food => {
                        const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesVeg = !vegOnly || food.type === 'Veg';
                        return matchesSearch && matchesVeg;
                    });
                    if (filteredItems.length === 0) {
                        return null;
                    }

                    return (
                        <div key={category} className="menu-category">
                            <div className="category-header">
                                <h3>{category} ({filteredItems.length})</h3>
                                <span className="dropdown-arrow"></span>
                            </div>
                            <div className="category-items">
                                {filteredItems.map(food => (
                                    <FoodItem
                                        key={food._id}
                                        id={food._id}
                                        name={food.name}
                                        price={food.price}
                                        description={food.description}
                                        image={food.image}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <hr className="separator" />
            <Reviews reviews={reviews} />

        </div>
    );
}

export default RestaurantDetail;