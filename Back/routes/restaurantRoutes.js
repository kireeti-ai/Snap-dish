import express from 'express';
import { getAllRestaurants, createRestaurant } from '../controllers/restaurantController.js';
import authMiddleware, { isRestaurantOwner } from '../middleware/authMiddleware.js';

const restaurantRouter = express.Router();

restaurantRouter.get('/', getAllRestaurants);
restaurantRouter.post('/', authMiddleware, isRestaurantOwner, createRestaurant);

export default restaurantRouter;