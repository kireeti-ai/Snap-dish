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
deliveryRouter.get("/earnings", deliveryOnly, getEarnings);

deliveryRouter.get("/available-orders", deliveryOnly, getAvailableOrders);
deliveryRouter.get("/active-order", deliveryOnly, getActiveOrder);
deliveryRouter.post("/accept-order", deliveryOnly, acceptOrder);

deliveryRouter.post("/update-status", deliveryOnly, updateOrderStatus);

export default deliveryRouter;