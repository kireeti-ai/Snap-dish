import express from "express";
import { 
    placeOrder, 
    getUserOrders, 
    listAllOrders,
    updateOrderStatus,
    updateOrderByRestaurant,
    acceptDelivery,getRestaurantOrders         
} from "../controllers/orderController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/place", protect, placeOrder);
orderRouter.get("/myorders", protect, getUserOrders);
orderRouter.get("/restaurant", protect, restrictTo('restaurant_owner', 'admin'), getRestaurantOrders);
orderRouter.post("/restaurant/update", protect, restrictTo('restaurant_owner', 'admin'), updateOrderByRestaurant);
orderRouter.post("/delivery/accept", protect, restrictTo('delivery_agent', 'admin'), acceptDelivery);
orderRouter.get("/list", protect, restrictTo('admin'), listAllOrders);
orderRouter.post("/status", protect, restrictTo('admin'), updateOrderStatus);

export default orderRouter;