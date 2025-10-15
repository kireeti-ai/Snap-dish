import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import restaurantModel from '../models/restaurantModel.js';
/**
 * @route   POST /api/order/place
 * @desc    Place a new order
 * @access  Private
 */
const emitOrderStatusUpdate = async (io, orderId) => {
    try {
        const order = await orderModel.findById(orderId);
        if (order) {
            
            io.to(orderId.toString()).emit('orderStatusUpdated', order);
        }
    } catch (error) {
        console.error("Error emitting socket update:", error);
    }
}
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.user.id, 
            restaurantId: req.body.restaurantId, 
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: "Pending Confirmation" 
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
    const { io } = req;
    try {
        const { orderId } = req.body;
        await orderModel.findByIdAndUpdate(orderId, {
            status: "Out for Delivery",
            deliveryAgentId: req.user.id
        });
        await emitOrderStatusUpdate(io, orderId);
        res.json({ success: true, message: "Delivery accepted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error accepting delivery" });
    }
};
export const updateOrderByRestaurant = async (req, res) => {
    const { io } = req;
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (status === "Awaiting Delivery Agent") {
            
            io.to('delivery_agents').emit('newDeliveryAvailable', updatedOrder);
        }
        await emitOrderStatusUpdate(io, orderId);

        res.json({ success: true, message: "Order updated by restaurant" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating order" });
    }
}

/**
 * @route   GET /api/order/myorders
 * @desc    Get logged in user's orders
 * @access  Private
 */
const getUserOrders = async (req, res) => {
    try {
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
    const { io } = req;
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        await emitOrderStatusUpdate(io, orderId);
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};
export const getRestaurantOrders = async (req, res) => {
    try {
        
        const restaurant = await restaurantModel.findOne({ owner_id: req.user.id });
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found for this user." });
        }
        const orders = await orderModel.find({ restaurantId: restaurant._id }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching restaurant orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

export { placeOrder, getUserOrders};