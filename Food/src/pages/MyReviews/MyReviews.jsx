import React, { useContext } from "react";
import { motion } from "framer-motion";
import './MyReviews.css';

const MyReviews = () => {
  const { restaurant_list, userName } = useContext(RestaurantContext);

  const userReviews = (restaurant_list || []).flatMap((restaurant) =>
    (restaurant.reviews || [])
      .filter((review) => review.reviewerName === userName)
      .map((review) => ({
        ...review,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        restaurantCuisine: restaurant.cuisine,
      }))
  );

  return (
    <div className="my-reviews-page">
      <h1>My Reviews</h1>

      {userReviews.length === 0 ? (
        <p className="no-reviews">You haven't written any reviews yet.</p>
      ) : (
        <div className="reviews-grid">
          {userReviews.map((review, index) => (
            <motion.div
              key={index}
              className="review-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="review-card-header">
                <img
                  src={review.restaurantImage}
                  alt={review.restaurantName}
                  className="review-restaurant-image"
                />
                <div>
                  <h3>{review.restaurantName}</h3>
                  <p>{review.restaurantCuisine}</p>
                </div>
              </div>
              <div className="review-card-content">
                <p className="review-rating">Rating: {review.rating} ★</p>
                <p className="review-comment">{review.comment}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;