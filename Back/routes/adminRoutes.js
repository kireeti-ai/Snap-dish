import express from "express";
import { 
    getAdminStatistics, 
    getSettings, 
    updateSettings,
    getUserStatistics 
} from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();


adminRouter.get("/statistics", protect, restrictTo('admin'), getAdminStatistics);
adminRouter.get("/user-statistics", protect, restrictTo('admin'), getUserStatistics);
adminRouter.get("/settings", protect, restrictTo('admin'), getSettings);
adminRouter.put("/settings", protect, restrictTo('admin'), updateSettings);

export default adminRouter;