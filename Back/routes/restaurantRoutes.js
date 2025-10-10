import express from "express";
import { 
    getAllRestaurants,
    getMyRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getAllRestaurantsForAdmin,
    updateRestaurantStatusByAdmin,
    deleteRestaurantByAdmin,
    updateRestaurantByAdmin
} from "../controllers/restaurantController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const restaurantRouter = express.Router();

// Public routes
restaurantRouter.get("/list", getAllRestaurants);

// Protected routes - Restaurant Owner
restaurantRouter.get("/my-restaurant", protect, getMyRestaurant);
restaurantRouter.post("/create", protect, upload.single('image'), createRestaurant);
restaurantRouter.put("/update", protect, upload.single('image'), updateRestaurant);
restaurantRouter.delete("/delete", protect, deleteRestaurant);

// Admin routes
restaurantRouter.get("/admin/all", protect, restrictTo('admin'), getAllRestaurantsForAdmin);
restaurantRouter.put("/admin/:restaurantId/status", protect, restrictTo('admin'), updateRestaurantStatusByAdmin);
restaurantRouter.put("/admin/:restaurantId", protect, restrictTo('admin'), upload.single('image'), updateRestaurantByAdmin);
restaurantRouter.delete("/admin/:restaurantId", protect, restrictTo('admin'), deleteRestaurantByAdmin);

export default restaurantRouter;