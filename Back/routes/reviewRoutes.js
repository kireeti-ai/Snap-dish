import express from 'express';
import { createReview, getReviewsByRestaurant } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const reviewRouter = express.Router();

// POST /api/review - Create a new review (requires user to be logged in)
reviewRouter.post('/', authMiddleware, createReview);

// GET /api/review/:restaurantId - Get all reviews for a restaurant
reviewRouter.get('/:restaurantId', getReviewsByRestaurant);

export default reviewRouter;