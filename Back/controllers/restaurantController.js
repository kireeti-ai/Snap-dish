import restaurantModel from '../models/restaurantModel.js';
import fs from 'fs';

export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({ status: 'active' })
            .select('-owner_id');
        res.json({ success: true, data: restaurants });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
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
        const existingRestaurant = await restaurantModel.findOne({ owner_id: req.user._id });
        if (existingRestaurant) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.log("Error deleting file:", err);
                });
            }
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
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.log("Error deleting file:", err);
            });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateRestaurant = async (req, res) => {
    const { name, address, cuisine, price_for_two, status, timing } = req.body;
    
    try {
        const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
        
        if (!restaurant) {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.log("Error deleting file:", err);
                });
            }
            return res.status(404).json({ 
                success: false, 
                message: 'Restaurant not found' 
            });
        }

        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.cuisine = cuisine || restaurant.cuisine;
        restaurant.price_for_two = price_for_two || restaurant.price_for_two;
        restaurant.status = status || restaurant.status;
        restaurant.timing = timing || restaurant.timing;
        
        if (req.file) {
            // FIXED: Use correct path for restaurant images
            if (restaurant.image) {
                fs.unlink(`uploads/restaurants/${restaurant.image}`, (err) => {
                    if (err) console.log("Error deleting old file:", err);
                });
            }
            restaurant.image = req.file.filename;
        }

        const updatedRestaurant = await restaurant.save();
        res.json({ success: true, data: updatedRestaurant });
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.log("Error deleting file:", err);
            });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
export const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
        
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        // Delete the associated image from storage
        if (restaurant.image) {
            fs.unlink(`uploads/restaurants/${restaurant.image}`, (err) => {
                if (err) console.log("Error deleting restaurant image:", err);
            });
        }
        
        // Note: You might also want to delete associated menu items here.

        await restaurantModel.deleteOne({ _id: restaurant._id });

        res.json({ success: true, message: 'Restaurant closed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};