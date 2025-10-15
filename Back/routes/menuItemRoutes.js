import express from 'express';
import { addMenuItem, listAllMenuItems, listMenuItemsByRestaurant, updateMenuItem, removeMenuItem } from '../controllers/menuItemController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const menuItemRouter = express.Router();


const storage = multer.diskStorage({
    destination: "uploads", 
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });
menuItemRouter.post("/add", protect, upload.single("image"), addMenuItem);
menuItemRouter.get("/list", listAllMenuItems);
menuItemRouter.get("/list/:restaurantId", listMenuItemsByRestaurant);
menuItemRouter.put("/update", protect, upload.single("image"), updateMenuItem);
menuItemRouter.delete("/remove/:id", protect, removeMenuItem);

export default menuItemRouter;