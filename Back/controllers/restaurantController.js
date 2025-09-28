import restaurantModel from "../models/restaurantModel.js";
import userModel from "../models/userModel.js";
import uploadToCloudinary from '../utils/cloudinary.js';

// --- Get all active restaurants (No changes) ---
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({ status: "active" }).select("-owner_id");
    res.json({ success: true, data: restaurants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Get my restaurant (No changes) ---
export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
    if (!restaurant)
      return res.status(404).json({ success: false, message: "No restaurant found" });

    res.json({ success: true, data: restaurant });
  } catch (err)
  {
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
      return res.status(400).json({ success: false, message: "You already have a restaurant" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path, 'restaurants');
      if (!imageUrl) {
        return res.status(500).json({ success: false, message: 'Error uploading image' });
      }
    }

    const restaurant = await restaurantModel.create({
      owner_id: req.user._id,
      name,
      address,
      cuisine,
      price_for_two,
      status,
      timing,
      image: imageUrl,
    });

    await userModel.findByIdAndUpdate(req.user._id, { role: 'restaurant_owner' });
    
    res.status(201).json({ success: true, message: "Restaurant created successfully!", data: restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Update restaurant ---
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    const { name, address, cuisine, price_for_two, status, timing } = req.body;

    if (name) restaurant.name = name;
    if (address) restaurant.address = address;
    if (cuisine) restaurant.cuisine = cuisine;
    if (price_for_two) restaurant.price_for_two = price_for_two;
    if (status) restaurant.status = status;
    if (timing) restaurant.timing = timing;

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.path, 'restaurants');
      if (imageUrl) {
        restaurant.image = imageUrl;
      }
    }

    await restaurant.save();
    res.json({ success: true, data: restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- Delete restaurant (No changes needed) ---
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findOne({ owner_id: req.user._id });
    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });

    await restaurantModel.deleteOne({ _id: restaurant._id });

    res.json({ success: true, message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// --- ADMIN FUNCTIONS ---

// [ADMIN] Get all restaurants regardless of status
export const getAllRestaurantsForAdmin = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({}).populate('owner_id', 'firstName lastName email');
        res.json({ success: true, data: restaurants });
    } catch (error) {
        console.error("Admin Get Restaurants Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// [ADMIN] Update any restaurant's status
export const updateRestaurantStatusByAdmin = async (req, res) => {
    try {
        const { status } = req.body;
        const restaurantId = req.params.restaurantId;

        if (!['active', 'inactive', 'pending_approval'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const restaurant = await restaurantModel.findByIdAndUpdate(
            restaurantId,
            { status },
            { new: true }
        );

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        res.json({ success: true, message: `Restaurant status updated to ${status}`, data: restaurant });
    } catch (error) {
        console.error("Admin Update Restaurant Status Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// [ADMIN] Delete any restaurant
export const deleteRestaurantByAdmin = async (req, res) => {
    try {
        const restaurant = await restaurantModel.findById(req.params.restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }
        await restaurantModel.deleteOne({ _id: req.params.restaurantId });
        res.json({ success: true, message: "Restaurant deleted by admin" });
    } catch (error) {
        console.error("Admin Delete Restaurant Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// [ADMIN] Update any restaurant's details
export const updateRestaurantByAdmin = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const updateData = req.body;
        
        // Handle image upload if a new one is provided
        if (req.file) {
            const imageUrl = await uploadToCloudinary(req.file.path, 'restaurants');
            if (imageUrl) {
                updateData.image = imageUrl;
            }
        }

        const updatedRestaurant = await restaurantModel.findByIdAndUpdate(
            restaurantId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        res.json({ success: true, message: "Restaurant details updated by admin", data: updatedRestaurant });
    } catch (error) {
        console.error("Admin Update Restaurant Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};