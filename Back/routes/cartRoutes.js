import express from 'express';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

cartRouter.post('/add', protect, addToCart);
cartRouter.post('/remove', protect, removeFromCart);
cartRouter.get('/get', protect, getCart); // FIXED: Changed from POST to GET (more RESTful)

export default cartRouter;