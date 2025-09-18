import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true // Each user has one cart
    },
    items: [{
        menuItemId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'menuItem', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1 
        }
    }],
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);
export default cartModel;