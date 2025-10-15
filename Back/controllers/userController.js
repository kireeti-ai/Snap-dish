import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import fs from "fs";
import path from "path";
import uploadToCloudinary from '../utils/cloudinary.js';

// Helper function to create a token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};
export const validateToken = async (req, res) => {
    try {
        res.json({
            success: true,
            role: req.user.role,
            userId: req.user._id
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token validation failed'
        });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: "Account is inactive"
            });
        }

        const token = createToken(user._id);

        res.json({ 
            success: true, 
            token, 
            role: user.role,
            firstName: user.firstName,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred during login" 
        });
    }
};
export const getWishlist = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error getting wishlist" });
    }
};

// Update user wishlist
export const updateWishlist = async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.user._id, { wishlist: req.body.wishlist });
        res.json({ success: true, message: "Wishlist updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating wishlist" });
    }
};

// Register user
export const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, phone_number, role } = req.body;

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const newUser = new userModel({
            firstName,
            lastName,
            email,
            phone_number,
            password,
            role
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({
            success: true,
            token,
            role: user.role,
            firstName: user.firstName,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error registering user" });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone_number: user.phone_number,
                address: user.address,
                dob: user.dob,
                gender: user.gender,
                role: user.role,
                status: user.status,
                avatar: user.avatar,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Error fetching profile" });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            phone_number, 
            address, 
            dob, 
            gender,
            avatar 
        } = req.body;
        
        const userId = req.user._id;

        // Validate email if it's being updated
        if (email && !validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Check if email is already taken by another user
        if (email && email !== req.user.email) {
            const emailExists = await userModel.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return res.json({ success: false, message: "Email already in use" });
            }
        }

        const updateData = {
            firstName,
            lastName,
            email,
            phone_number,
            address,
            dob,
            gender
        };

        // Only update avatar if provided
        if (avatar) {
            updateData.avatar = avatar;
        }

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone_number: updatedUser.phone_number,
                address: updatedUser.address,
                dob: updatedUser.dob,
                gender: updatedUser.gender,
                role: updatedUser.role,
                status: updatedUser.status,
                avatar: updatedUser.avatar,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let avatarPath;

        // Try to upload to Cloudinary first
        try {
            const localFilePath = req.file.path;
            avatarPath = await uploadToCloudinary(localFilePath, 'avatars');
            
            if (!avatarPath) {
                throw new Error('Cloudinary upload failed');
            }
        } catch (cloudinaryError) {
            console.error('Cloudinary upload error:', cloudinaryError);
            // Fall back to local storage
            avatarPath = `uploads/avatars/${req.file.filename}`;
        }

        // Delete old avatar if it exists and is a local file
        if (user.avatar && user.avatar.startsWith('uploads/')) {
            const oldAvatarPath = path.join(process.cwd(), user.avatar);
            if (fs.existsSync(oldAvatarPath)) {
                try {
                    fs.unlinkSync(oldAvatarPath);
                } catch (deleteError) {
                    console.error('Error deleting old avatar:', deleteError);
                }
            }
        }

        // Update user avatar
        user.avatar = avatarPath;
        await user.save();

        res.json({
            success: true,
            message: 'Avatar uploaded successfully',
            avatarPath: avatarPath,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone_number: user.phone_number,
                address: user.address,
                dob: user.dob,
                gender: user.gender,
                role: user.role,
                status: user.status,
                avatar: user.avatar,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error uploading avatar', 
            error: error.message 
        });
    }
};

// Delete user account
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // If avatar exists and is a local file, remove it
        if (user.avatar && user.avatar.startsWith('uploads/')) {
            const avatarPath = path.join(process.cwd(), user.avatar);
            if (fs.existsSync(avatarPath)) {
                try {
                    fs.unlinkSync(avatarPath);
                } catch (deleteError) {
                    console.error('Error deleting avatar file:', deleteError);
                }
            }
        }

        await userModel.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: "Account deleted successfully. Thank you for using our service!",
        });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ success: false, message: "Error deleting account" });
    }
};


// --- ADMIN FUNCTIONS ---

// [ADMIN] Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password");
        res.json({ success: true, data: users });
    } catch (error) {
        console.error("Admin Get Users Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// [ADMIN] Update any user's status
export const updateUserStatusByAdmin = async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.params.userId;

        if (!['active', 'inactive', 'suspended'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: `User status updated to ${status}`, data: user });
    } catch (error) {
        console.error("Admin Update User Status Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// [ADMIN] Delete any user
export const deleteUserByAdmin = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await userModel.findByIdAndDelete(req.params.userId);
        res.json({ success: true, message: "User deleted by admin successfully" });
    } catch (error) {
        console.error("Admin Delete User Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// [ADMIN] Update any user's details (name, email, role, etc.)
export const updateUserByAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updateData = req.body;

        // Prevent password updates through this endpoint for security
        delete updateData.password; 

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User details updated by admin", data: updatedUser });
    } catch (error) {
        console.error("Admin Update User Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, cartData: user.cartData });
    } catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({ success: false, message: "Error getting cart data" });
    }
};

// Update user cart
export const updateCart = async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id, 
            { cartData: req.body },
            { new: true }
        );
         if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "Cart updated" });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: "Error updating cart" });
    }
};

