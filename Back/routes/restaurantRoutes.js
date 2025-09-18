import express from 'express';
import { 
    getAllRestaurants, 
    createRestaurant, 
    getMyRestaurant, 
    updateRestaurant 
} from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);

// Protected routes
router.get('/my-restaurant', protect, getMyRestaurant);
router.post('/', protect, upload.single("image"), createRestaurant);
router.put('/my-restaurant', protect, upload.single("image"), updateRestaurant);

export default router;