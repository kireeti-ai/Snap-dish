import express from 'express';
import { addMenuItem, listAllMenuItems, listMenuItemsByRestaurant, updateMenuItem, removeMenuItem } from '../controllers/menuItemController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const menuItemRouter = express.Router();

// Image Storage Engine Configuration
// This can be part of a shared uploadMiddleware.js file
const storage = multer.diskStorage({
    destination: "uploads", // A temporary folder for uploads before they go to Cloudinary
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Define the routes
menuItemRouter.post("/add", protect, upload.single("image"), addMenuItem);
menuItemRouter.get("/list", listAllMenuItems);
menuItemRouter.get("/list/:restaurantId", listMenuItemsByRestaurant);
menuItemRouter.put("/update", protect, upload.single("image"), updateMenuItem);

// --- FIX: Changed from .post to .delete ---
menuItemRouter.delete("/remove/:id", protect, removeMenuItem);

export default menuItemRouter;