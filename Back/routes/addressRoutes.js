import express from "express";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.put("/:id",protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

export default router;
