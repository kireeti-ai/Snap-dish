import express from "express";
import { 
    getRestaurantDashboardStats,
    getRestaurantSalesChartData,
    getRestaurantRecentOrders,
    getRestaurantTopDishes,
    getRevenueOrdersComparison
} from "../controllers/restaurantDashboardController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const restaurantDashboardRouter = express.Router();

// Apply authentication middleware to all routes
restaurantDashboardRouter.use(protect);
restaurantDashboardRouter.use(restrictTo('restaurant_owner', 'admin'));

// Restaurant Dashboard routes
restaurantDashboardRouter.get("/stats", getRestaurantDashboardStats);
restaurantDashboardRouter.get("/sales-chart", getRestaurantSalesChartData);
restaurantDashboardRouter.get("/recent-orders", getRestaurantRecentOrders);
restaurantDashboardRouter.get("/top-dishes", getRestaurantTopDishes);
restaurantDashboardRouter.get("/revenue-orders-comparison", getRevenueOrdersComparison); // NEW ROUTE

export default restaurantDashboardRouter;