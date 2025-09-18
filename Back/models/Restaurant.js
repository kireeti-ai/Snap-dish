import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 0 },
    price_for_two: { type: Number, required: true },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending_approval'],
        default: 'pending_approval'
    }
});

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);
export default restaurantModel;