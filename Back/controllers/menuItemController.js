import menuItemModel from '../models/MenuItem.js';
import fs from 'fs'; 

export const addMenuItem = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Image is required" });
        }

        const image_filename = req.file.filename;
        const { restaurantId, name, description, price, category, is_veg } = req.body;

        const menuItem = new menuItemModel({
            restaurant_id: restaurantId,
            name: name,
            description: description,
            price: Number(price),
            category: category,
            image: image_filename,
            is_veg: is_veg === 'true' || is_veg === true
        });

        await menuItem.save();
        res.json({ success: true, message: "Menu Item Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding menu item" });
    }
};

export const listAllMenuItems = async (req, res) => {
    try {
        const menuItems = await menuItemModel.find({});
        res.json({ success: true, data: menuItems });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching menu items" });
    }
};

export const listMenuItemsByRestaurant = async (req, res) => {
    try {
        const menuItems = await menuItemModel.find({ restaurant_id: req.params.restaurantId });
        res.json({ success: true, data: menuItems });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching menu items" });
    }
};

export const removeMenuItem = async (req, res) => {
    try {
        const menuItem = await menuItemModel.findById(req.body.id);
        if (!menuItem) {
            return res.json({ success: false, message: "Menu item not found" });
        }
        
        fs.unlink(`uploads/foods/${menuItem.image}`, (err) => {
            if (err) console.log("Error deleting file:", err);
        });
        
        await menuItemModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Menu Item Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing menu item" });
    }
};