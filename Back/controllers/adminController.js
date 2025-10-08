import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import restaurantModel from "../models/restaurantModel.js";
import settingsModel from "../models/settingsModel.js";

// @desc    Get admin dashboard statistics
export const getAdminStatistics = async (req, res) => {
    try {
        // Get total orders
        const totalOrders = await orderModel.countDocuments();
        
        // Calculate total revenue
        const revenueData = await orderModel.aggregate([
            { $match: { status: "Delivered" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Get active customers count
        const activeCustomers = await userModel.countDocuments({ 
            role: "customer",
            status: "active" 
        });

        // Get active restaurants count
        const activeRestaurants = await restaurantModel.countDocuments({ 
            status: "active" 
        });

        // Get order status breakdown
        const ordersByStatus = await orderModel.aggregate([
            { 
                $group: { 
                    _id: "$status", 
                    count: { $sum: 1 } 
                } 
            }
        ]);

        // Get recent orders (last 10)
        const recentOrders = await orderModel.find()
            .sort({ date: -1 })
            .limit(10)
            .populate('userId', 'firstName lastName email')
            .populate('restaurantId', 'name');

        // Calculate daily revenue for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyRevenue = await orderModel.aggregate([
            {
                $match: {
                    status: "Delivered",
                    date: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { format: "%Y-%m-%d", date: "$date" } 
                    },
                    revenue: { $sum: "$amount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalOrders,
                    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                    activeCustomers,
                    activeRestaurants
                },
                ordersByStatus,
                recentOrders,
                dailyRevenue
            }
        });
    } catch (error) {
        console.error("Get Admin Statistics Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get platform settings
export const getSettings = async (req, res) => {
    try {
        // Find the settings document
        let settings = await settingsModel.findOne();

        // If no settings exist, create a default document
        if (!settings) {
            console.log("No settings found, creating default settings document.");
            settings = new settingsModel({
                commissionRate: 15,
                deliveryFee: 5,
                platformName: 'SnapDish',
                supportEmail: 'support@snapdish.com'
            });
            await settings.save();
        }

        res.json({ success: true, data: settings });
    } catch (error) {
        console.error("Get Settings Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update platform settings
export const updateSettings = async (req, res) => {
    try {
        const { commissionRate, deliveryFee, platformName, supportEmail } = req.body;
        
        // Validate commission rate
        if (commissionRate !== undefined) {
            const rate = parseFloat(commissionRate);
            if (isNaN(rate) || rate < 0 || rate > 100) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Commission rate must be a number between 0 and 100" 
                });
            }
        }

        // Validate delivery fee
        if (deliveryFee !== undefined) {
            const fee = parseFloat(deliveryFee);
            if (isNaN(fee) || fee < 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Delivery fee must be a positive number" 
                });
            }
        }

        // Validate email format
        if (supportEmail !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(supportEmail)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid email format" 
                });
            }
        }

        // Find or create settings
        let settings = await settingsModel.findOne();
        if (!settings) {
            settings = new settingsModel();
        }

        // Update fields
        if (commissionRate !== undefined) settings.commissionRate = parseFloat(commissionRate);
        if (deliveryFee !== undefined) settings.deliveryFee = parseFloat(deliveryFee);
        if (platformName !== undefined) settings.platformName = platformName.trim();
        if (supportEmail !== undefined) settings.supportEmail = supportEmail.trim();
        
        // Set updatedBy if user is authenticated - FIX: Use req.user._id instead of req.user.id
        if (req.user?._id) {
           settings.updatedBy = req.user._id;
        }

        await settings.save();

        res.json({ 
            success: true, 
            message: "Settings updated successfully",
            data: settings 
        });
    } catch (error) {
        console.error("Update Settings Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get user statistics by role
export const getUserStatistics = async (req, res) => {
    try {
        const usersByRole = await userModel.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        const usersByStatus = await userModel.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Get total users
        const totalUsers = await userModel.countDocuments();

        res.json({
            success: true,
            data: {
                total: totalUsers,
                byRole: usersByRole,
                byStatus: usersByStatus
            }
        });
    } catch (error) {
        console.error("Get User Statistics Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};