import orderModel from "../models/orderModel.js";
import restaurantModel from "../models/restaurantModel.js";
import menuItemModel from "../models/menuItemModel.js";

/**
 * @route   GET /api/restaurant/dashboard/stats
 * @desc    Get restaurant owner's dashboard statistics
 * @access  Private (Restaurant Owner)
 */
export const getRestaurantDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        
        const restaurant = await restaurantModel.findOne({ owner_id: userId });
        
        if (!restaurant) {
            return res.status(404).json({ 
                success: false, 
                message: "Restaurant not found for this user" 
            });
        }
        const totalOrders = await orderModel.countDocuments({ 
            restaurantId: restaurant._id 
        });
        const revenueData = await orderModel.aggregate([
            { 
                $match: { 
                    restaurantId: restaurant._id,
                    status: "Delivered" 
                } 
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        const pendingOrders = await orderModel.countDocuments({ 
            restaurantId: restaurant._id,
            status: { $in: ["Pending Confirmation", "Preparing"] } 
        });
        const completedOrders = await orderModel.countDocuments({ 
            restaurantId: restaurant._id,
            status: "Delivered" 
        });

        const totalMenuItems = await menuItemModel.countDocuments({ 
            restaurant_id: restaurant._id 
        });

        const activeMenuItems = await menuItemModel.countDocuments({ 
            restaurant_id: restaurant._id,
            is_available: true 
        });
        const topDish = await orderModel.aggregate([
            { $match: { restaurantId: restaurant._id } },
            { $unwind: "$items" },
            { 
                $group: { 
                    _id: "$items.name", 
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                } 
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 1 }
        ]);

        // 8. Order Status Breakdown
        const ordersByStatus = await orderModel.aggregate([
            { $match: { restaurantId: restaurant._id } },
            { 
                $group: { 
                    _id: "$status", 
                    count: { $sum: 1 } 
                } 
            }
        ]);

        // 9. Today's orders
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const todayOrders = await orderModel.countDocuments({
            restaurantId: restaurant._id,
            date: { $gte: startOfDay }
        });

        // 10. Today's revenue
        const todayRevenueData = await orderModel.aggregate([
            { 
                $match: { 
                    restaurantId: restaurant._id,
                    status: "Delivered",
                    date: { $gte: startOfDay }
                } 
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].total : 0;

        res.json({
            success: true,
            data: {
                restaurantName: restaurant.name,
                restaurantStatus: restaurant.status,
                totalOrders,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                pendingOrders,
                completedOrders,
                totalMenuItems,
                activeMenuItems,
                topDish: topDish.length > 0 ? topDish[0]._id : "N/A",
                ordersByStatus,
                todayOrders,
                todayRevenue: parseFloat(todayRevenue.toFixed(2))
            }
        });
    } catch (error) {
        console.error("Get Restaurant Dashboard Stats Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching dashboard statistics",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/restaurant/dashboard/sales-chart
 * @desc    Get sales data for chart (last 7 days)
 * @access  Private (Restaurant Owner)
 */
export const getRestaurantSalesChartData = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const restaurant = await restaurantModel.findOne({ owner_id: userId });
        
        if (!restaurant) {
            return res.status(404).json({ 
                success: false, 
                message: "Restaurant not found" 
            });
        }

        const days = parseInt(req.query.days) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const salesData = await orderModel.aggregate([
            {
                $match: {
                    restaurantId: restaurant._id,
                    date: { $gte: startDate },
                    status: "Delivered"
                }
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { format: "%Y-%m-%d", date: "$date" } 
                    },
                    sales: { $sum: "$amount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const chartData = salesData.map(item => ({
            day: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
            date: item._id,
            sales: parseFloat(item.sales.toFixed(2)),
            orders: item.orders
        }));

        res.json({
            success: true,
            data: chartData
        });
    } catch (error) {
        console.error("Get Restaurant Sales Chart Data Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching sales chart data",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/restaurant/dashboard/recent-orders
 * @desc    Get recent orders for restaurant
 * @access  Private (Restaurant Owner)
 */
export const getRestaurantRecentOrders = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const restaurant = await restaurantModel.findOne({ owner_id: userId });
        
        if (!restaurant) {
            return res.status(404).json({ 
                success: false, 
                message: "Restaurant not found" 
            });
        }

        const limit = parseInt(req.query.limit) || 10;

        const recentOrders = await orderModel
            .find({ restaurantId: restaurant._id })
            .sort({ date: -1 })
            .limit(limit)
            .populate('userId', 'firstName lastName email phone_number')
            .populate('deliveryAgentId', 'firstName lastName phone_number');

        const formattedOrders = recentOrders.map(order => ({
            orderId: order._id,
            orderNumber: `#${order._id.toString().slice(-6)}`,
            customerName: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'N/A',
            customerPhone: order.userId?.phone_number || 'N/A',
            items: order.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
            amount: order.amount,
            status: order.status,
            date: order.date,
            deliveryAgent: order.deliveryAgentId 
                ? `${order.deliveryAgentId.firstName} ${order.deliveryAgentId.lastName}` 
                : 'Not Assigned',
            address: order.address
        }));

        res.json({
            success: true,
            data: formattedOrders
        });
    } catch (error) {
        console.error("Get Restaurant Recent Orders Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching recent orders",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/restaurant/dashboard/top-dishes
 * @desc    Get top selling dishes for restaurant
 * @access  Private (Restaurant Owner)
 */
export const getRestaurantTopDishes = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const restaurant = await restaurantModel.findOne({ owner_id: userId });
        
        if (!restaurant) {
            return res.status(404).json({ 
                success: false, 
                message: "Restaurant not found" 
            });
        }

        const limit = parseInt(req.query.limit) || 5;

        const topDishes = await orderModel.aggregate([
            { $match: { restaurantId: restaurant._id } },
            { $unwind: "$items" },
            { 
                $group: { 
                    _id: "$items.name", 
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
                    avgPrice: { $avg: "$items.price" }
                } 
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: limit }
        ]);

        const formattedDishes = topDishes.map(dish => ({
            name: dish._id,
            quantity: dish.totalQuantity,
            revenue: parseFloat(dish.totalRevenue.toFixed(2)),
            avgPrice: parseFloat(dish.avgPrice.toFixed(2))
        }));

        res.json({
            success: true,
            data: formattedDishes
        });
    } catch (error) {
        console.error("Get Restaurant Top Dishes Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching top dishes",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @route   GET /api/restaurant/dashboard/revenue-orders-comparison
 * @desc    Get revenue vs orders comparison data for visualization
 * @access  Private (Restaurant Owner)
 */
export const getRevenueOrdersComparison = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const restaurant = await restaurantModel.findOne({ owner_id: userId });
        
        if (!restaurant) {
            return res.status(404).json({ 
                success: false, 
                message: "Restaurant not found" 
            });
        }

        const days = parseInt(req.query.days) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        // Aggregate data for revenue and orders
        const comparisonData = await orderModel.aggregate([
            {
                $match: {
                    restaurantId: restaurant._id,
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { format: "%Y-%m-%d", date: "$date" } 
                    },
                    totalOrders: { $sum: 1 },
                    deliveredOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0]
                        }
                    },
                    revenue: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Delivered"] }, "$amount", 0]
                        }
                    },
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format data for chart
        const chartData = comparisonData.map(item => {
            const avgOrderValue = item.deliveredOrders > 0 
                ? item.revenue / item.deliveredOrders 
                : 0;

            return {
                day: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
                date: item._id,
                orders: item.totalOrders,
                revenue: parseFloat(item.revenue.toFixed(2)),
                deliveredOrders: item.deliveredOrders,
                avgOrderValue: parseFloat(avgOrderValue.toFixed(2))
            };
        });

        // Fill in missing days with zero values
        const filledData = [];
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            date.setHours(0, 0, 0, 0);
            
            const dateString = date.toISOString().split('T')[0];
            const existingData = chartData.find(d => d.date === dateString);
            
            if (existingData) {
                filledData.push(existingData);
            } else {
                filledData.push({
                    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    date: dateString,
                    orders: 0,
                    revenue: 0,
                    deliveredOrders: 0,
                    avgOrderValue: 0
                });
            }
        }

        res.json({
            success: true,
            data: filledData
        });
    } catch (error) {
        console.error("Get Revenue Orders Comparison Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching revenue orders comparison data",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};