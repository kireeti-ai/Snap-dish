import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate JWT token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// @desc Register new user
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, phone_number, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ firstName, lastName, email, phone_number, password });
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Update profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone_number = req.body.phone_number || user.phone_number;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.gender = req.body.gender || user.gender;
    if (req.body.password) user.password = req.body.password;
    if (req.body.avatar) user.avatar = req.body.avatar;

    const updatedUser = await user.save();
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Upload profile avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });
    res.json({ success: true, user, avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error uploading avatar", error: err.message });
  }
};