import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import fs from "fs";
import path from "path";

// Helper function to create a token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
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
        console.log(error);
        res.json({ success: false, message: "Error" });
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
                role: user.role,
                status: user.status,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching profile" });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone_number, avatar } = req.body;
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
            phone_number
        };

        // Only update avatar if provided
        if (avatar) {
            updateData.avatar = avatar;
        }

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
                role: updatedUser.role,
                status: updatedUser.status,
                avatar: updatedUser.avatar,
                createdAt: updatedUser.createdAt,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const userId = req.user._id;
        const avatarPath = `uploads/avatars/${req.file.filename}`;

        // Update user's avatar in database
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { avatar: avatarPath },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            // Delete uploaded file if user not found
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            message: "Avatar uploaded successfully",
            avatarPath: avatarPath,
            user: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone_number: updatedUser.phone_number,
                role: updatedUser.role,
                status: updatedUser.status,
                avatar: updatedUser.avatar,
                createdAt: updatedUser.createdAt,
            }
        });
    } catch (error) {
        console.log(error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: "Error uploading avatar" });
    }
};