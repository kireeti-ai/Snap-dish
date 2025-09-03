// Food/src/components/RestaurantReviews/RestaurantReviews.jsx
import React, { useState, useContext, useEffect } from 'react';
import './RestaurantReviews.css';
import { StoreContext } from '../../Context/StoreContext';

// Star Rating Component
const StarRating = ({ rating, onRatingChange, interactive = false, size = 'medium' }) => {
  const [hover, setHover] = useState(0);
  
  const sizeClasses = {
    small: 'star-small',
    medium: 'star-medium', 
    large: 'star-large'
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            type={interactive ? "button" : undefined}
            className={`star-btn ${sizeClasses[size]} ${
              interactive ? 'interactive' : 'static'
            } ${ratingValue <= (hover || rating) ? 'active' : 'inactive'}`}
            onClick={interactive ? () => onRatingChange(ratingValue) : undefined}
            onMouseEnter={interactive ? () => setHover(ratingValue) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
            disabled={!interactive}
          >
            ★
          </button>
        );
      })}
      {rating > 0 && (
        <span className="rating-text">
          {rating.toFixed(1)} out of 5
        </span>
      )}
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ restaurantId, onSuccess, existingReview = null, onCancel }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { url, token } = useContext(StoreContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = existingReview 
        ? `${url}/api/reviews/${existingReview._id}`
        : `${url}/api/reviews`;
      
      const method = existingReview ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          rating,
          comment
        })
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        if (!existingReview) {
          setRating(0);
          setComment('');
        }
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <div className="review-form">
        <h3>{existingReview ? 'Update Your Review' : 'Write a Review'}</h3>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-content">
          <div className="rating-section">
            <label>Your Rating *</label>
            <StarRating 
              rating={rating} 
              onRatingChange={setRating} 
              interactive={true}
              size="large"
            />
          </div>

          <div className="comment-section">
            <label>Your Review (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience..."
              rows="4"
            />
          </div>

          <div className="form-actions">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-cancel"
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className="btn-submit"
            >
              {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Review Component
const ReviewCard = ({ review, onEdit, onDelete, currentUserId }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isOwner = review.user_id._id === currentUserId;
  const commentPreview = review.comment?.length > 150 
    ? review.comment.substring(0, 150) + '...' 
    : review.comment;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setLoading(true);
      await onDelete(review._id);
      setLoading(false);
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="user-info">
          <div className="user-avatar">
            {review.user_id.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h4>{review.user_id.name}</h4>
            <p className="review-date">{formatDate(review.created_at)}</p>
          </div>
        </div>
        
        {isOwner && (
          <div className="review-actions">
            <button
              onClick={() => onEdit(review)}
              className="action-btn edit-btn"
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="action-btn delete-btn"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <div className="review-rating">
        <StarRating rating={review.rating} size="small" />
      </div>

      {review.comment && (
        <div className="review-comment">
          <p>
            {showFullComment || !commentPreview.includes('...') 
              ? review.comment 
              : commentPreview}
          </p>
          {review.comment.length > 150 && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="read-more-btn"
            >
              {showFullComment ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Main Reviews Section Component
const RestaurantReviews = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, totalReviews: 0 });
  
  const { url, token, userName } = useContext(StoreContext);
  const currentUserId = token ? 'current_user_id' : null; // You'll need to get this from your auth context

  useEffect(() => {
    loadReviews(1);
  }, [restaurantId]);

  const loadReviews = async (pageNum) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${url}/api/reviews/restaurant/${restaurantId}?page=${pageNum}&limit=10`);
      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setReviews(data.reviews);
        } else {
          setReviews(prev => [...prev, ...data.reviews]);
        }
        
        setReviewStats({
          avgRating: data.avgRating || 0,
          totalReviews: data.totalReviews || 0
        });
        
        setHasMore(data.pagination?.hasMore || false);
      } else {
        setError(data.message || 'Failed to load reviews');
      }
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadReviews(nextPage);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(`${url}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setReviews(prev => prev.filter(review => review._id !== reviewId));
        setReviewStats(prev => ({
          ...prev,
          totalReviews: prev.totalReviews - 1
        }));
      } else {
        alert(data.message || 'Failed to delete review');
      }
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const handleFormSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setPage(1);
    loadReviews(1); // Reload reviews
  };

  const handleCancelForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  return (
    <div className="restaurant-reviews">
      {/* Review Summary */}
      <div className="reviews-summary">
        <div className="summary-content">
          <div className="summary-left">
            <h2>Customer Reviews</h2>
            <div className="rating-overview">
              <StarRating rating={reviewStats.avgRating} size="medium" />
              <span className="review-count">
                ({reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
          
          <div className="summary-right">
            {token ? (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="write-review-btn"
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </button>
            ) : (
              <p className="login-prompt">
                Please login to write a review
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm 
          restaurantId={restaurantId}
          onSuccess={handleFormSuccess}
          existingReview={editingReview}
          onCancel={handleCancelForm}
        />
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {loading && page === 1 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <>
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserId={currentUserId}
              />
            ))}
            
            {hasMore && (
              <div className="load-more-section">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="load-more-btn"
                >
                  {loading ? 'Loading...' : 'Load More Reviews'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-reviews">
            <p>No reviews yet. Be the first to review this restaurant!</p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default RestaurantReviews;