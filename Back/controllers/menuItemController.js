import menuItemModel from '../models/menuItemModel.js';
import restaurantModel from '../models/restaurantModel.js'; // ADDED: Missing import
import fs from 'fs'; 

export const addMenuItem = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Image is required" });
        }

        const image_filename = req.file.filename;
        const { restaurantId, name, description, price, category, is_veg } = req.body;

        // ADDED: Verify restaurant ownership
        const restaurant = await restaurantModel.findOne({ 
            _id: restaurantId, 
            owner_id: req.user._id 
        });
        
        if (!restaurant) {
            // Delete uploaded file if unauthorized
            fs.unlink(`uploads/foods/${image_filename}`, (err) => {
                if (err) console.log("Error deleting file:", err);
            });
            return res.json({ success: false, message: "Restaurant not found or unauthorized" });
        }

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
        const menuItems = await menuItemModel.find({ is_available: true })
            .populate('restaurant_id', 'name address cuisine rating');
        res.json({ success: true, data: menuItems });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching menu items" });
    }
};

export const listMenuItemsByRestaurant = async (req, res) => {
    try {
        const menuItems = await menuItemModel.find({ 
            restaurant_id: req.params.restaurantId,
            is_available: true 
        });
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

        // ADDED: Verify ownership
        const restaurant = await restaurantModel.findOne({
            _id: menuItem.restaurant_id,
            owner_id: req.user._id
        });
        
        if (!restaurant) {
            return res.json({ success: false, message: "Unauthorized" });
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

export const updateMenuItem = async (req, res) => {
    try {
        const { id, name, description, price, category, is_veg } = req.body;

        const menuItem = await menuItemModel.findById(id);
        if (!menuItem) {
            return res.json({ success: false, message: "Menu item not found" });
        }

        // ADDED: Verify ownership
        const restaurant = await restaurantModel.findOne({
            _id: menuItem.restaurant_id,
            owner_id: req.user._id
        });
        
        if (!restaurant) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // If new image uploaded, delete old one
        if (req.file) {
            fs.unlink(`uploads/foods/${menuItem.image}`, (err) => {
                if (err) console.log("Error deleting old file:", err);
            });
            menuItem.image = req.file.filename;
        }

        // Update fields
        if (name) menuItem.name = name;
        if (description) menuItem.description = description;
        if (price) menuItem.price = Number(price);
        if (category) menuItem.category = category;
        if (is_veg !== undefined) menuItem.is_veg = is_veg === "true" || is_veg === true;

        await menuItem.save();

        res.json({ success: true, message: "Menu Item Updated", data: menuItem });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating menu item" });
    }
};
