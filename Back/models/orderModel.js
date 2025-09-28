import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    deliveryAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { 
        type: String, 
        enum: [
            "Pending Confirmation", // Customer places order
            "Preparing",            // Restaurant accepts order
            "Awaiting Delivery Agent", // Food is ready for pickup
            "Out for Delivery",     // Delivery agent accepts
            "Delivered",            // Order complete
            "Cancelled"             // Order cancelled by any party
        ],
        default: "Pending Confirmation" 
    },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;