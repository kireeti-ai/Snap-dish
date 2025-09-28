import express from "express";
import { 
    placeOrder, 
    getUserOrders, 
    listAllOrders,
    updateOrderStatus,
    updateOrderByRestaurant, // <-- Import new function
    acceptDelivery           // <-- Import new function
} from "../controllers/orderController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

// -- User Route --
orderRouter.post("/place", protect, placeOrder);
orderRouter.get("/myorders", protect, getUserOrders);

// -- Restaurant Route --
orderRouter.post("/restaurant/update", protect, restrictTo('restaurant_owner', 'admin'), updateOrderByRestaurant);

// -- Delivery Agent Route --
orderRouter.post("/delivery/accept", protect, restrictTo('delivery_agent', 'admin'), acceptDelivery);

// -- Admin Routes --
orderRouter.get("/list", protect, restrictTo('admin'), listAllOrders);
orderRouter.post("/status", protect, restrictTo('admin'), updateOrderStatus); // General admin update

export default orderRouter;