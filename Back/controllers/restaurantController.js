import restaurantModel from '../models/Restaurant.js';

export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({});
        res.json({ success: true, data: restaurants });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// NEW: Get current user's restaurant
export const getMyRestaurant = async (req, res) => {
    try {
        const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
        
        if (!restaurant) {
            return res.status(404).json({ 
                success: false, 
                message: 'No restaurant found. Please create your restaurant first.' 
            });
        }

        res.json({ success: true, data: restaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const createRestaurant = async (req, res) => {
    const { name, address, cuisine, price_for_two, status, timing } = req.body;
    
    try {
        // Check if user already has a restaurant
        const existingRestaurant = await restaurantModel.findOne({ owner_id: req.user._id });
        if (existingRestaurant) {
            return res.status(400).json({ 
                success: false, 
                message: 'You already have a restaurant. Use update instead.' 
            });
        }

        const newRestaurant = new restaurantModel({
            owner_id: req.user._id, 
            name,
            address,
            cuisine,
            price_for_two,
            status,
            timing,
            image: req.file ? req.file.filename : null
        });

        const restaurant = await newRestaurant.save();
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// NEW: Update existing restaurant
export const updateRestaurant = async (req, res) => {
    const { name, address, cuisine, price_for_two, status, timing } = req.body;
    
    try {
        const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
        
        if (!restaurant) {
            return res.status(404).json({ 
                success: false, 
                message: 'Restaurant not found' 
            });
        }

        // Update fields
        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.cuisine = cuisine || restaurant.cuisine;
        restaurant.price_for_two = price_for_two || restaurant.price_for_two;
        restaurant.status = status || restaurant.status;
        restaurant.timing = timing || restaurant.timing;
        
        if (req.file) {
            restaurant.image = req.file.filename;
        }

        const updatedRestaurant = await restaurant.save();
        res.json({ success: true, data: updatedRestaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};