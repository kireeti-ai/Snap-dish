import express from 'express';
import { 
    getAllRestaurants, 
    createRestaurant, 
    getMyRestaurant, 
    updateRestaurant,
    deleteRestaurant 
} from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/my-restaurant', protect, getMyRestaurant);
router.post('/', protect, upload.single("image"), createRestaurant);
router.put('/my-restaurant', protect, upload.single("image"), updateRestaurant);
router.delete('/my-restaurant', protect, deleteRestaurant);

export default router;