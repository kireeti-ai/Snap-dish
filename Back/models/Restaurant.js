import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    is_available: { type: Boolean, default: true },
});

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    address: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    cuisine_type: String,
    status: { type: String, enum: ['active', 'disabled', 'pending_approval'], default: 'pending_approval' },
    menu: [menuItemSchema],
    onboarding_date: { type: Date, default: Date.now }
});

restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;