import express from 'express';
import { addMenuItem, listAllMenuItems, listMenuItemsByRestaurant, removeMenuItem } from '../controllers/menuItemController.js';
import {protect} from '../middleware/authMiddleware.js';
import multer from 'multer';

const menuItemRouter = express.Router();

// Image Storage Engine Configuration
const storage = multer.diskStorage({
    destination: "uploads/foods",
    filename: (req, file, cb) => {
        // Creates a unique filename to prevent overwriting
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Define the routes
menuItemRouter.post("/add", protect, upload.single("image"), addMenuItem);
menuItemRouter.get("/list", listAllMenuItems);
menuItemRouter.get("/list/:restaurantId", listMenuItemsByRestaurant);
menuItemRouter.post("/remove", protect, removeMenuItem);

export default menuItemRouter;