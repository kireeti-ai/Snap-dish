import express from 'express';
import { getMenuItemsByRestaurant, addMenuItem } from '../controllers/menuItemController.js';
import authMiddleware, { isRestaurantOwner } from '../middleware/authMiddleware.js';
import multer from 'multer';

const menuItemRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

menuItemRouter.get('/:restaurantId', getMenuItemsByRestaurant);
menuItemRouter.post('/', authMiddleware, isRestaurantOwner, upload.single("image"), addMenuItem);

export default menuItemRouter;