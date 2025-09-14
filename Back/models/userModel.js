import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  phone_number: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"]
  },
  password: { type: String, required: true },
  avatar: { type: String, default: "/api/placeholder/120/120" },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ["male", "female", "other", "prefer-not-to-say"], 
    default: "prefer-not-to-say"
  },
  role: { 
    type: String, 
    enum: ["customer", "admin", "restaurant_owner", "delivery_agent"], 
    default: "customer" 
  },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
  addresses: [{ type: Object }],
  favorite_restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
  cartData: { type: Object, default: {} }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;