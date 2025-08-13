import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

// To prevent a user from reviewing the same restaurant multiple times
reviewSchema.index({ user_id: 1, restaurant_id: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;