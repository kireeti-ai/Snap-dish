import express from "express";
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);
router.patch("/:id/default", protect, setDefaultAddress); 

export default router;