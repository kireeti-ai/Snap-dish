import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { 
    placeOrder, 
    verifyOrder, 
    userOrders, 
    getAllOrders, 
    updateOrderStatus 
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// Customer routes
orderRouter.post("/place", protect, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/user-orders", protect, userOrders);

// Admin/Restaurant owner routes
orderRouter.get("/all", protect, restrictTo('restaurant_owner', 'admin'), getAllOrders);
orderRouter.put("/status", protect, restrictTo('restaurant_owner', 'admin'), updateOrderStatus);

export default orderRouter;