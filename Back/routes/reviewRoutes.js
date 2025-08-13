import express from 'express';
import { createRestaurantReview, getRestaurantReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This setup is for routes like POST /api/restaurants/:restaurantId/reviews
router.route('/restaurants/:restaurantId/reviews')
    .post(protect, createRestaurantReview)
    .get(getRestaurantReviews);

export default router;