import menuItemModel from '../models/MenuItem.js';

// Get all menu items for a specific restaurant
export const getMenuItemsByRestaurant = async (req, res) => {
    try {
        const menuItems = await menuItemModel.find({ restaurant_id: req.params.restaurantId });
        res.json({ success: true, data: menuItems });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Add a new menu item (for restaurant owners)
export const addMenuItem = async (req, res) => {
    const { name, description, price, category, is_veg } = req.body;
    const image = req.file.filename;

    try {
        const newMenuItem = new menuItemModel({
            restaurant_id: req.body.restaurantId, // Assuming restaurantId is passed in the request
            name,
            description,
            price,
            image,
            category,
            is_veg
        });
        const menuItem = await newMenuItem.save();
        res.status(201).json({ success: true, data: menuItem });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};