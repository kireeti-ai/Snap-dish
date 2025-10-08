import express from "express";
import { 
    getAdminStatistics, 
    getSettings, 
    updateSettings,
    getUserStatistics 
} from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();
const adminOnly = [protect, restrictTo('admin')];

// Admin statistics
adminRouter.get("/statistics", ...adminOnly, getAdminStatistics);
adminRouter.get("/user-statistics", ...adminOnly, getUserStatistics);

// Platform settings
adminRouter.get("/settings", ...adminOnly, getSettings);
adminRouter.put("/settings", ...adminOnly, updateSettings);

export default adminRouter;