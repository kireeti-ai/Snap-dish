import Address from "../models/addressModel.js";

// GET all addresses for logged-in user
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST add new address
export const addAddress = async (req, res) => {
  try {
    if (req.body.isDefault) {
      // Reset other addresses as not default
      await Address.updateMany({ userId: req.user.id }, { $set: { isDefault: false } });
    }

    const address = new Address({ ...req.body, userId: req.user.id });
    await address.save();

    res.json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT update address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.isDefault) {
      await Address.updateMany({ userId: req.user.id }, { $set: { isDefault: false } });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Address not found" });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE remove address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Address.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, message: "Address not found" });

    res.json({ success: true, message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
