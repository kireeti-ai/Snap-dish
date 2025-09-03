import React from 'react';
import './Reviews.css';
import { assets } from '../../assets/assets';

const Reviews = ({ reviews }) => {
    return (
        <div className="reviews-section">
            <h3 className="reviews-heading">Reviews</h3>
            {reviews && reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <div key={index} className="review">
                        <div className="review-header">
                            <img src={assets.profile_icon} alt="profile" className="review-profile-icon" />
                            <span className="reviewer-name">{review.reviewerName}</span>
                        </div>
                        <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                                <img
                                    key={i}
                                    src={assets.star}
                                    alt="star"
                                    className={`star-icon ${i < review.rating ? 'filled' : ''}`}
                                />
                            ))}
                        </div>
                        <p className="review-comment">{review.comment}</p>
                    </div>
                ))
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    );
};

export default Reviews;