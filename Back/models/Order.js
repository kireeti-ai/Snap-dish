// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurant', required: true },
    delivery_agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'deliveryAgent' },
    delivery_address: { type: Object, required: true },
    items: [{
        item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'menuItem' },
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number }
    }],
    total_amount: { type: Number, required: true },
    order_date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    payment: {type:Boolean,default:false}
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;