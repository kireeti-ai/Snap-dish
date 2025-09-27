import menuItemModel from "../models/menuItemModel.js";
import restaurantModel from "../models/restaurantModel.js";
import uploadToCloudinary from "../utils/cloudinary.js";

// ADD MENU ITEM
export const addMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, description, price, category, is_veg } = req.body;

    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }

    const restaurant = await restaurantModel.findOne({
      _id: restaurantId,
      owner_id: req.user._id,
    });

    if (!restaurant) {
      return res.json({
        success: false,
        message: "Restaurant not found or unauthorized",
      });
    }

    // --- FIX: Use req.file.path instead of req.file.buffer ---
    const imageUrl = await uploadToCloudinary(req.file.path, "foods");
    if (!imageUrl) {
        return res.json({ success: false, message: "Error uploading image to cloud" });
    }

    const menuItem = new menuItemModel({
      restaurant_id: restaurantId,
      name,
      description,
      price: Number(price),
      category,
      image: imageUrl, // Save the full Cloudinary URL
      is_veg: is_veg === "true" || is_veg === true,
    });

    await menuItem.save();
    res.json({ success: true, message: "Menu Item Added", data: menuItem });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding menu item" });
  }
};

// LIST ALL MENU ITEMS (No changes)
export const listAllMenuItems = async (req, res) => {
  try {
    const menuItems = await menuItemModel
      .find({ is_available: true })
      .populate("restaurant_id", "name address cuisine rating");
    res.json({ success: true, data: menuItems });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching menu items" });
  }
};

// LIST BY RESTAURANT (No changes)
export const listMenuItemsByRestaurant = async (req, res) => {
  try {
    const menuItems = await menuItemModel.find({
      restaurant_id: req.params.restaurantId,
      is_available: true,
    });
    res.json({ success: true, data: menuItems });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching menu items" });
  }
};

// REMOVE MENU ITEM (No changes to logic, just the route)
export const removeMenuItem = async (req, res) => {
  try {
    const menuItem = await menuItemModel.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    const restaurant = await restaurantModel.findOne({
      _id: menuItem.restaurant_id,
      owner_id: req.user._id,
    });

    if (!restaurant) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await menuItemModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Menu Item Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error removing menu item" });
  }
};

// UPDATE MENU ITEM
export const updateMenuItem = async (req, res) => {
  try {
    const { id, name, description, price, category, is_veg } = req.body;

    const menuItem = await menuItemModel.findById(id);
    if (!menuItem) {
      return res.json({ success: false, message: "Menu item not found" });
    }

    const restaurant = await restaurantModel.findOne({
      _id: menuItem.restaurant_id,
      owner_id: req.user._id,
    });

    if (!restaurant) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (req.file) {
      // --- FIX: Use req.file.path here as well ---
      const imageUrl = await uploadToCloudinary(req.file.path, "foods");
      if (imageUrl) {
        menuItem.image = imageUrl;
      }
    }

    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = Number(price);
    if (category) menuItem.category = category;
    if (is_veg !== undefined) menuItem.is_veg = is_veg === "true" || is_veg === true;

    await menuItem.save();
    res.json({ success: true, message: "Menu Item Updated", data: menuItem });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating menu item" });
  }
};