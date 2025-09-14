// models/Address.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
    country: { type: String, required: true },
    is_default: { type: Boolean, default: false }
});

const addressModel = mongoose.models.address || mongoose.model("address", addressSchema);
export default addressModel;