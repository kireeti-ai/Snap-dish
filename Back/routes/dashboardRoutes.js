import express from "express";
import { 
    getRestaurantDashboardStats,
    getRestaurantSalesChartData,
    getRestaurantRecentOrders,
    getRestaurantTopDishes
} from "../controllers/restaurantDashboardController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const restaurantDashboardRouter = express.Router();
const restaurantOnly = [protect, restrictTo('restaurant_owner', 'admin')];

// Restaurant Dashboard routes
restaurantDashboardRouter.get("/stats", restaurantOnly, getRestaurantDashboardStats);
restaurantDashboardRouter.get("/sales-chart", restaurantOnly, getRestaurantSalesChartData);
restaurantDashboardRouter.get("/recent-orders", restaurantOnly, getRestaurantRecentOrders);
restaurantDashboardRouter.get("/top-dishes", restaurantOnly, getRestaurantTopDishes);

export default restaurantDashboardRouter;