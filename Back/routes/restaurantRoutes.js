import express from 'express';
import { getAllRestaurants, createRestaurant } from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';

const restaurantRouter = express.Router();

restaurantRouter.get('/', getAllRestaurants);
restaurantRouter.post('/', protect, createRestaurant);

export default restaurantRouter;