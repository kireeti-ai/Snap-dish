import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import restaurantModel from "../models/restaurantModel.js";
import settingsModel from "../models/settingsModel.js";
import rateLimit from 'express-rate-limit';

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

export const getAdminStatistics = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        let totalOrders = 0;
        let activeCustomers = 0;
        let activeRestaurants = 0;
        let revenueData = [];
        let ordersByStatus = [];
        let recentOrders = [];
        let dailyRevenue = [];

        try {
            totalOrders = await orderModel.countDocuments() || 0;
        } catch (err) {
            console.error('Error fetching orders count:', err);
        }

        try {
            activeCustomers = await userModel.countDocuments({ 
                role: 'customer', 
                status: 'active' 
            }) || 0;
        } catch (err) {
            console.error('Error fetching customers count:', err);
        }

        try {
            activeRestaurants = await restaurantModel.countDocuments({ 
                status: 'active' 
            }) || 0;
        } catch (err) {
            console.error('Error fetching restaurants count:', err);
        }

        try {
            revenueData = await orderModel.aggregate([
                { 
                    $match: { 
                        status: "Delivered",
                        amount: { $exists: true, $type: "number" }
                    } 
                },
                { 
                    $group: { 
                        _id: null, 
                        total: { $sum: "$amount" } 
                    } 
                }
            ]);
        } catch (err) {
            console.error('Error calculating revenue:', err);
            revenueData = [{ total: 0 }];
        }

        try {
            ordersByStatus = await orderModel.aggregate([
                {
                    $match: {
                        status: { $exists: true }
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);
        } catch (err) {
            console.error('Error fetching orders by status:', err);
            ordersByStatus = [];
        }

        try {
            // Updated to match your schema fields
            recentOrders = await orderModel.find()
                .sort({ date: -1 })
                .limit(5)
                .populate({
                    path: 'userId',
                    select: 'firstName lastName email',
                    model: 'User'
                })
                .populate({
                    path: 'restaurantId',
                    select: 'name',
                    model: 'restaurant'
                })
                .lean();

            // Transform the data to match the expected format
            recentOrders = recentOrders.map(order => ({
                _id: order._id,
                amount: order.amount || 0,
                status: order.status || 'Unknown',
                user: {
                    name: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'N/A',
                    email: order.userId?.email || 'N/A'
                },
                restaurant: {
                    name: order.restaurantId?.name || 'N/A'
                },
                date: order.date
            }));
        } catch (err) {
            console.error('Error fetching recent orders:', err);
            recentOrders = [];
        }

        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            dailyRevenue = await orderModel.aggregate([
                {
                    $match: {
                        date: { $gte: sevenDaysAgo },
                        status: "Delivered",
                        amount: { $exists: true, $type: "number" }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$date" }
                        },
                        total: { $sum: "$amount" }
                    }
                },
                { $sort: { _id: 1 } }
            ]);
        } catch (err) {
            console.error('Error fetching daily revenue:', err);
            dailyRevenue = [];
        }

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        res.json({
            success: true,
            data: {
                overview: {
                    totalOrders,
                    totalRevenue,
                    activeCustomers,
                    activeRestaurants
                },
                ordersByStatus,
                recentOrders,
                dailyRevenue
            }
        });
    } catch (error) {
        console.error("Admin Statistics Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching statistics",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Settings controllers remain the same
export const getSettings = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        let settings = await settingsModel.findOne();

        if (!settings) {
            settings = new settingsModel({
                commissionRate: 15,
                deliveryFee: 5,
                platformName: 'SnapDish',
                supportEmail: 'support@snapdish.com'
            });
            await settings.save();
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error("Get Settings Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const updateSettings = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const { commissionRate, deliveryFee, platformName, supportEmail } = req.body;

        if (commissionRate < 0 || commissionRate > 100) {
            return res.status(400).json({
                success: false,
                message: 'Commission rate must be between 0 and 100'
            });
        }

        if (deliveryFee < 0) {
            return res.status(400).json({
                success: false,
                message: 'Delivery fee cannot be negative'
            });
        }

        let settings = await settingsModel.findOne();
        if (!settings) {
            settings = new settingsModel();
        }

        settings.commissionRate = commissionRate;
        settings.deliveryFee = deliveryFee;
        settings.platformName = platformName;
        settings.supportEmail = supportEmail;

        await settings.save();

        res.json({
            success: true,
            data: settings,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        console.error("Update Settings Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update settings",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const getUserStatistics = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const totalUsers = await userModel.countDocuments();
        const usersByRole = await userModel.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        const usersByStatus = await userModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentUsers = await userModel.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                totalUsers,
                usersByRole,
                usersByStatus,
                recentUsers
            }
        });
    } catch (error) {
        console.error("Get User Statistics Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user statistics",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};