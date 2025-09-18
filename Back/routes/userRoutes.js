import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserProfile, uploadAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected routes
userRouter.get('/profile', protect, getUserProfile);
userRouter.put('/profile', protect, updateUserProfile);
userRouter.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

export default userRouter;