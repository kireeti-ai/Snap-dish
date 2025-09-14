import reviewModel from '../models/Review.js';
import restaurantModel from '../models/Restaurant.js';

// Create a new review for a restaurant
export const createReview = async (req, res) => {
    const { restaurantId, rating, comment } = req.body;

    try {
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        const newReview = new reviewModel({
            user_id: req.body.userId,
            restaurant_id: restaurantId,
            rating,
            comment
        });

        const savedReview = await newReview.save();

        // Optional: Update the restaurant's average rating
        const reviews = await reviewModel.find({ restaurant_id: restaurantId });
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        restaurant.rating = totalRating / reviews.length;
        await restaurant.save();

        res.status(201).json({ success: true, data: savedReview });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get all reviews for a specific restaurant
export const getReviewsByRestaurant = async (req, res) => {
    try {
        const reviews = await reviewModel.find({ restaurant_id: req.params.restaurantId }).populate('user_id', 'name');
        res.json({ success: true, data: reviews });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};