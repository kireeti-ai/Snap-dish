import orderModel from "../models/orderModel.js";

// Helper to emit updates for a specific order
const emitOrderStatusUpdate = async (io, orderId) => {
    try {
        const order = await orderModel.findById(orderId)
            .populate('userId', 'firstName lastName email phone_number')
            .populate('restaurantId', 'name address')
            .populate('deliveryAgentId', 'firstName lastName phone_number');
        
        if (order) {
            // Emit to the order-specific room
            io.to(orderId.toString()).emit('orderStatusUpdated', order);
            console.log(`Emitted orderStatusUpdated for order ${orderId}`);
        }
    } catch (error) {
        console.error("Error emitting socket update:", error);
    }
};

// @desc    Get orders available for pickup
export const getAvailableOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ 
            status: "Awaiting Delivery Agent" 
        })
        .populate('restaurantId', 'name address phone_number')
        .populate('userId', 'firstName lastName phone_number')
        .sort({ date: -1 });
        
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Get Available Orders Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get the agent's current active order
export const getActiveOrder = async (req, res) => {
    try {
        const activeOrder = await orderModel.findOne({
            deliveryAgentId: req.user.id,
            status: { $in: ["Out for Delivery", "Reached Restaurant", "Picked Up"] }
        })
        .populate('restaurantId', 'name address phone_number')
        .populate('userId', 'firstName lastName phone_number address');
        
        res.json({ success: true, data: activeOrder });
    } catch (error) {
        console.error("Get Active Order Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Accept an available order
export const acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const io = req.io; // Access io from request object

        // Check if order exists and is still available
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.status !== "Awaiting Delivery Agent") {
            return res.status(400).json({ 
                success: false, 
                message: "Order is no longer available" 
            });
        }

        // Check if agent already has an active order
        const existingActiveOrder = await orderModel.findOne({
            deliveryAgentId: req.user.id,
            status: { $in: ["Out for Delivery", "Reached Restaurant", "Picked Up"] }
        });

        if (existingActiveOrder) {
            return res.status(400).json({ 
                success: false, 
                message: "You already have an active delivery" 
            });
        }

        // Update order
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId, 
            {
                deliveryAgentId: req.user.id,
                status: "Out for Delivery"
            }, 
            { new: true }
        )
        .populate('restaurantId', 'name address phone_number')
        .populate('userId', 'firstName lastName phone_number address');

        // Emit socket update
        await emitOrderStatusUpdate(io, orderId);
        
        res.json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error("Accept Order Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Update status of an ongoing delivery
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const io = req.io; // Access io from request object

        // Validate status
        const validStatuses = ["Reached Restaurant", "Picked Up", "Delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status value" 
            });
        }

        // Security check: Ensure the order belongs to this agent
        const order = await orderModel.findOne({ 
            _id: orderId, 
            deliveryAgentId: req.user.id 
        });

        if (!order) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to update this order" 
            });
        }

        // Validate status progression
        const currentStatus = order.status;
        const statusProgression = {
            "Out for Delivery": ["Reached Restaurant"],
            "Reached Restaurant": ["Picked Up"],
            "Picked Up": ["Delivered"]
        };

        if (!statusProgression[currentStatus]?.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot change from ${currentStatus} to ${status}` 
            });
        }

        // Update order
        order.status = status;
        await order.save();

        // Populate for response
        await order.populate('restaurantId', 'name address phone_number');
        await order.populate('userId', 'firstName lastName phone_number address');
        
        // Emit socket update
        await emitOrderStatusUpdate(io, orderId);
        
        res.json({ success: true, data: order });

    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};