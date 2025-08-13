import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: {
            item_id: mongoose.Schema.Types.ObjectId,
            name: String,
            price: Number
        },
        required: true
    },
    quantity: { type: Number, required: true },
    price_per_item: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent' },
    items: [orderItemSchema],
    total_amount: { type: Number, required: true },
    order_status: { type: String, enum: ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' },
    payment: {
        payment_method: { type: String, enum: ['Card', 'UPI', 'COD'] },
        payment_status: { type: String, enum: ['completed', 'failed', 'pending'], default: 'pending' },
        transaction_id: String,
        payment_date: Date
    }
}, { timestamps: { createdAt: 'order_date', updatedAt: true } });

const Order = mongoose.model('Order', orderSchema);
export default Order;