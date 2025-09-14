// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurant', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    review_date: { type: Date, default: Date.now }
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;