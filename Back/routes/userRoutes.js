import express from 'express';
import { 
  loginUser, 
  registerUser, 
  deleteUser, 
  getUserProfile, 
  updateUserProfile, 
  uploadAvatar,
  getAllUsers,
  updateUserStatusByAdmin,
  deleteUserByAdmin,
  updateUserByAdmin
} from '../controllers/userController.js';
import {
    getAllRestaurantsForAdmin,
    updateRestaurantStatusByAdmin,
    deleteRestaurantByAdmin,
    updateRestaurantByAdmin
} from '../controllers/restaurantController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected routes - Profile management
userRouter.get('/profile', protect, getUserProfile);
userRouter.put('/profile', protect, updateUserProfile);

// Avatar upload route
userRouter.post('/upload-avatar', 
  protect, 
  upload.single('avatar'), 
  uploadAvatar
);

// Account deletion
userRouter.delete('/profile', protect, deleteUser);


// --- ADMIN ROUTES ---
const adminOnly = [protect, restrictTo('admin')];

// Admin routes for managing users
userRouter.get('/admin/users', adminOnly, getAllUsers);
userRouter.put('/admin/users/:userId/status', adminOnly, updateUserStatusByAdmin);
userRouter.delete('/admin/users/:userId', adminOnly, deleteUserByAdmin);
userRouter.put('/admin/users/:userId', adminOnly, updateUserByAdmin);

// Admin routes for managing restaurants
userRouter.get('/admin/restaurants', adminOnly, getAllRestaurantsForAdmin);
userRouter.put('/admin/restaurants/:restaurantId/status', adminOnly, updateRestaurantStatusByAdmin);
userRouter.delete('/admin/restaurants/:restaurantId', adminOnly, deleteRestaurantByAdmin);
userRouter.put('/admin/restaurants/:restaurantId', adminOnly, upload.single('image'), updateRestaurantByAdmin);


export default userRouter;