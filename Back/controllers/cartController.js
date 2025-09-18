import userModel from '../models/userModel.js';

// Add an item to the user's cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id; // FIXED: Use authenticated user ID
        const { itemId } = req.body;

        if (!itemId) {
            return res.json({ success: false, message: "Item ID is required" });
        }

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding item to cart" });
    }
};

// Remove an item from the user's cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id; // FIXED: Use authenticated user ID
        const { itemId } = req.body;

        if (!itemId) {
            return res.json({ success: false, message: "Item ID is required" });
        }

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (cartData[itemId] && cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing item from cart" });
    }
};

// Get the user's cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id; // FIXED: Use authenticated user ID
        
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: userData.cartData || {} });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching cart" });
    }
};