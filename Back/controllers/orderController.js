import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

// Initialize Stripe with proper error handling
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('⚠️  STRIPE_SECRET_KEY not found in environment variables. Payment processing will be disabled.');
}

export const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
    
    try {
        const userId = req.user._id;
        const { items, amount, address, restaurant } = req.body;

        // Validate required fields
        if (!items || !items.length) {
            return res.json({ success: false, message: "No items in order" });
        }
        if (!address || !restaurant) {
            return res.json({ success: false, message: "Address and restaurant are required" });
        }

        const newOrder = new orderModel({
            user: userId,
            restaurant: restaurant,
            items: items,
            totalPrice: amount,
            deliveryAddress: address
        });

        await newOrder.save();
        
        // Clear user's cart after placing order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Check if Stripe is available
        if (!stripe) {
            // For development/testing without Stripe
            await orderModel.findByIdAndUpdate(newOrder._id, { 
                paymentStatus: "paid" // Auto-approve for testing
            });
            return res.json({ 
                success: true, 
                message: "Order placed successfully (Payment processing disabled)",
                orderId: newOrder._id
            });
        }

        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 // Amount in paise
            },
            quantity: item.quantity
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 50 * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// Verify the payment status after returning from Stripe
export const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    
    try {
        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { 
                paymentStatus: "paid"
            });
            res.json({ success: true, message: "Payment successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed - order cancelled" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error verifying payment" });
    }
};

// Get a user's order history
export const userOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const orders = await orderModel.find({ user: userId })
            .populate('restaurant', 'name address')
            .populate('items.menuItem', 'name image')
            .sort({ createdAt: -1 }); // Most recent first
            
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Get all orders (for admin/restaurant owner)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
            .populate('user', 'firstName lastName email')
            .populate('restaurant', 'name address')
            .populate('items.menuItem', 'name image')
            .sort({ createdAt: -1 });
            
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        if (!orderId || !status) {
            return res.json({ success: false, message: "Order ID and status are required" });
        }

        const validStatuses = ["pending", "confirmed", "preparing", "out-for-delivery", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true }
        );

        if (!updatedOrder) {
            return res.json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order status updated", data: updatedOrder });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating order status" });
    }
};