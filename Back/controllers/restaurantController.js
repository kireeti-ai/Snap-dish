import restaurantModel from '../models/Restaurant.js';
import userModel from '../models/userModel.js';

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({});
        res.json({ success: true, data: restaurants });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create a new restaurant (for restaurant owners)
export const createRestaurant = async (req, res) => {
    const { name, address, cuisine, price_for_two } = req.body;
    try {
        const newRestaurant = new restaurantModel({
            owner_id: req.body.userId,
            name,
            address,
            cuisine,
            price_for_two
        });
        const restaurant = await newRestaurant.save();
        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};