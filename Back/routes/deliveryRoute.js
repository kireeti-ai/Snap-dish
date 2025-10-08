import express from "express";
import { 
    getAvailableOrders,
    acceptOrder,
    updateOrderStatus,
    getActiveOrder, 
    getOrderHistory,
    getEarnings
} from "../controllers/deliveryController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const deliveryRouter = express.Router();
const deliveryOnly = [protect, restrictTo('delivery_agent')];
deliveryRouter.get("/order-history", deliveryOnly, getOrderHistory);

// Get the agent's earnings statistics
deliveryRouter.get("/earnings", deliveryOnly, getEarnings);
// Get a list of all orders awaiting a delivery agent
deliveryRouter.get("/available-orders", deliveryOnly, getAvailableOrders);

// Get the agent's currently active order (if any)
deliveryRouter.get("/active-order", deliveryOnly, getActiveOrder);

// Accept a new order
deliveryRouter.post("/accept-order", deliveryOnly, acceptOrder);

// Update the status of an active order (e.g., Reached Restaurant, Picked Up, Delivered)
deliveryRouter.post("/update-status", deliveryOnly, updateOrderStatus);

export default deliveryRouter;