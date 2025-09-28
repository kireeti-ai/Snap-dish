import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true,
      trim: true 
    },
    lastName: { 
      type: String,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    phone_number: { 
      type: String,
      trim: true 
    },
    password: { 
      type: String, 
      required: true,
      minlength: 8 
    },
    role: {
      type: String,
      enum: ["customer", "restaurant_owner", "delivery_agent", "admin"],
      default: "customer",
    },
    avatar: { 
      type: String,
      default: null 
    },
    address: { 
      type: String,
      trim: true 
    },
    dob: { 
      type: Date 
    },
    gender: { 
      type: String, 
      enum: ["Male", "Female", "Other"],
      trim: true 
    },
    status: { 
      type: String, 
      enum: ["active", "inactive", "suspended"],
      default: "active" 
    },
    cartData: { 
      type: Object, 
      default: {} 
    }
  },
  { 
    timestamps: true
  }
);

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Transform method to control JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName;
});

const userModel = mongoose.model("User", userSchema);
export default userModel;