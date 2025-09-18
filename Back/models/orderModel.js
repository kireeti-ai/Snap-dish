import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant", required: true }, // FIXED: Changed from "Restaurant" to "restaurant"
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "menuItem", required: true }, // FIXED: Changed from "Menu" to "menuItem"
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }, // ADDED: Store price at order time
        name: { type: String, required: true } // ADDED: Store name at order time
      },
    ],
    totalPrice: { type: Number, required: true },
    deliveryAddress: { // ADDED: Proper address structure
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      phone: { type: String, required: true }
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out-for-delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: { // ADDED: Separate payment tracking
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    paymentMethod: { type: String, enum: ["stripe", "cash"], default: "stripe" },
    deliveryFee: { type: Number, default: 50 }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;