import restaurantModel from "../models/restaurantModel.js";
import userModel from "../models/userModel.js"; // <-- ADD THIS LINE
import fs from "fs";
import path from "path";

// Helper to delete image file
const deleteImage = (filename) => {
  if (!filename) return;
  const filePath = path.join("uploads/restaurants", filename);
  fs.unlink(filePath, (err) => {
    if (err) console.log("Error deleting file:", err);
  });
};

// --- Get all active restaurants ---
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({ status: "active" }).select("-owner_id");
    res.json({ success: true, data: restaurants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Get my restaurant ---
export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
    if (!restaurant)
      return res.status(404).json({ success: false, message: "No restaurant found" });

    res.json({ success: true, data: restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Create restaurant ---
export const createRestaurant = async (req, res) => {
  const { name, address, cuisine, price_for_two, status, timing } = req.body;
  try {
    const existing = await restaurantModel.findOne({ owner_id: req.user._id });
    if (existing) {
      deleteImage(req.file?.filename);
      return res.status(400).json({ success: false, message: "You already have a restaurant" });
    }

    const restaurant = await restaurantModel.create({
      owner_id: req.user._id,
      name,
      address,
      cuisine,
      price_for_two,
      status,
      timing,
      image: req.file?.filename || null,
    });

    // This line is correct, but requires the import above
    await userModel.findByIdAndUpdate(req.user._id, { role: 'restaurant_owner' });
    
    res.status(201).json({ success: true, message: "Restaurant created and user role updated successfully!", data: restaurant });
  } catch (err) {
    deleteImage(req.file?.filename);
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Update restaurant ---
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
    if (!restaurant) {
      deleteImage(req.file?.filename);
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    const { name, address, cuisine, price_for_two, status, timing } = req.body;

    // Update fields if provided
    if (name) restaurant.name = name;
    if (address) restaurant.address = address;
    if (cuisine) restaurant.cuisine = cuisine;
    if (price_for_two) restaurant.price_for_two = price_for_two;
    if (status) restaurant.status = status;
    if (timing) restaurant.timing = timing;

    // Update image
    if (req.file) {
      deleteImage(restaurant.image);
      restaurant.image = req.file.filename;
    }

    await restaurant.save();
    res.json({ success: true, data: restaurant });
  } catch (err) {
    deleteImage(req.file?.filename);
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Delete restaurant ---
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });

    deleteImage(restaurant.image);

    await restaurantModel.deleteOne({ _id: restaurant._id });

    res.json({ success: true, message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};