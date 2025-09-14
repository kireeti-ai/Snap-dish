// models/MenuItem.js
import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    is_veg: { type: Boolean, default: false },
    is_available: { type: Boolean, default: true }
});

const menuItemModel = mongoose.models.menuItem || mongoose.model("menuItem", menuItemSchema);
export default menuItemModel;