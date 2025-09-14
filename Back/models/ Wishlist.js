// models/Wishlist.js
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'menuItem', required: true }
});

const wishlistModel = mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema);
export default wishlistModel;