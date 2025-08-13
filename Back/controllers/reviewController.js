import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Create a new review
// @route   POST /api/restaurants/:restaurantId/reviews
// @access  Private
const createRestaurantReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { restaurantId } = req.params;

    try {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if the user has already reviewed this restaurant
        const alreadyReviewed = await Review.findOne({
            user_id: req.user._id,
            restaurant_id: restaurantId,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this restaurant' });
        }

        // Create a new review
        const review = new Review({
            user_id: req.user._id,
            restaurant_id: restaurantId,
            name: req.user.name, // Add user's name to the review for display
            rating: Number(rating),
            comment,
        });

        await review.save();

        res.status(201).json({ message: 'Review added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get reviews for a restaurant
// @route   GET /api/restaurants/:restaurantId/reviews
// @access  Public
const getRestaurantReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ restaurant_id: req.params.restaurantId }).populate('user_id', 'name');
        
        if (!reviews) {
            return res.status(404).json({ message: 'No reviews found for this restaurant' });
        }

        res.json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export { createRestaurantReview, getRestaurantReviews };