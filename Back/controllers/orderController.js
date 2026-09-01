import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import restaurantModel from '../models/restaurantModel.js';
import { createDigitalSignature, verifyDigitalSignature } from '../utils/security.js';

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
        // Create order data for signature (ensuring data integrity)
        const orderData = {
            userId: req.user.id,
            restaurantId: req.body.restaurantId,
            items: req.body.items,
            amount: req.body.amount,
            timestamp: Date.now()
        };

        // Generate digital signature for the order (data integrity)
        const orderSignature = createDigitalSignature(orderData);

        const newOrder = new orderModel({
            userId: req.user.id,
            restaurantId: req.body.restaurantId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: "Pending Confirmation",
            orderSignature: orderSignature // Store signature for verification
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });
        res.json({ success: true, message: "Order placed, awaiting confirmation.", orderId: newOrder._id });
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
 * @desc    Get logged in user's orders with signature verification
 * @access  Private
 */
const getUserOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.user.id }).sort({ date: -1 });

        // Verify digital signatures for all orders (Data Integrity Check)
        const verifiedOrders = orders.map(order => {
            const orderData = {
                userId: order.userId.toString(),
                restaurantId: order.restaurantId.toString(),
                items: order.items,
                amount: order.amount,
                timestamp: order.timestamp
            };

            const isSignatureValid = verifyDigitalSignature(orderData, order.orderSignature);

            return {
                ...order.toObject(),
                signatureStatus: isSignatureValid ? 'verified' : 'invalid',
                integrityCheck: isSignatureValid ? 'Order data integrity confirmed' : 'Warning: Order data may have been tampered'
            };
        });

        res.json({ success: true, data: verifiedOrders });
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

        // Verify digital signatures for all orders (Data Integrity Verification)
        const verifiedOrders = orders.map(order => {
            const orderData = {
                userId: order.userId.toString(),
                restaurantId: order.restaurantId.toString(),
                items: order.items,
                amount: order.amount,
                timestamp: order.timestamp
            };

            const isSignatureValid = verifyDigitalSignature(orderData, order.orderSignature);

            return {
                ...order.toObject(),
                signatureStatus: isSignatureValid ? 'verified' : 'invalid',
                dataIntegrity: isSignatureValid ? 'confirmed' : 'compromised'
            };
        });

        res.json({ success: true, data: verifiedOrders });
    } catch (error) {
        console.error("Error fetching restaurant orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

/**
 * @route   GET /api/order/verify/:orderId
 * @desc    Verify the digital signature of a specific order
 * @access  Private
 * @demonstration Shows digital signature verification in action
 */
export const verifyOrderSignature = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Reconstruct original order data
        const orderData = {
            userId: order.userId.toString(),
            restaurantId: order.restaurantId.toString(),
            items: order.items,
            amount: order.amount,
            timestamp: order.timestamp
        };

        // Verify the signature
        const isSignatureValid = verifyDigitalSignature(orderData, order.orderSignature);
        const expectedSignature = createDigitalSignature(orderData);

        res.json({
            success: true,
            orderId: orderId,
            signatureVerification: {
                isValid: isSignatureValid,
                storedSignature: order.orderSignature,
                expectedSignature: expectedSignature,
                match: order.orderSignature === expectedSignature,
                message: isSignatureValid ? '✓ Order data is authentic and unmodified' : '✗ Order data has been tampered with'
            },
            orderData: {
                userId: order.userId,
                restaurantId: order.restaurantId,
                amount: order.amount,
                itemCount: order.items.length
            }
        });
    } catch (error) {
        console.error("Error verifying order signature:", error);
        res.status(500).json({ success: false, message: "Error verifying signature" });
    }
};

export { placeOrder, getUserOrders };