import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';

/**
 * @route   POST /api/order/place
 * @desc    Place a new order
 * @access  Private
 */
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.user.id, 
            restaurantId: req.body.restaurantId, // Frontend must now send this
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: "Pending Confirmation" // New initial status
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });
        res.json({ success: true, message: "Order placed, awaiting confirmation." });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};
export const acceptDelivery = async (req, res) => {
    try {
        const { orderId } = req.body;
        await orderModel.findByIdAndUpdate(orderId, {
            status: "Out for Delivery",
            deliveryAgentId: req.user.id
        });
        res.json({ success: true, message: "Delivery accepted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error accepting delivery" });
    }
};
export const updateOrderByRestaurant = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        // Add logic here to ensure req.user.id owns the restaurant associated with the order
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order updated by restaurant" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating order" });
    }
};

/**
 * @route   GET /api/order/myorders
 * @desc    Get logged in user's orders
 * @access  Private
 */
const getUserOrders = async (req, res) => {
    try {
        // Find orders belonging to the logged-in user
        const orders = await orderModel.find({ userId: req.user.id }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders." });
    }
};
/**
 * @route   GET /api/order/list
 * @desc    List all orders for admin panel
 * @access  Private (Admin)
 */
export const listAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error listing all orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

/**
 * @route   POST /api/order/status
 * @desc    Update order status by admin
 * @access  Private (Admin)
 */
export const updateOrderStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, getUserOrders};