import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: { 
    type: String, 
    required: true,
    default: "Home"
  },
  // Add new fields
  firstName: { 
    type: String, 
    required: false,  // Make optional for backward compatibility
    default: ""
  },
  lastName: { 
    type: String, 
    required: false,
    default: ""
  },
  email: { 
    type: String, 
    required: false,
    default: ""
  },
  street: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  // Keep OLD field names for backward compatibility
  zip: { 
    type: String, 
    required: true 
  },
  num: { 
    type: String, 
    required: true 
  },
  // Add NEW field names (these will be used going forward)
  zipCode: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false,
    default: "India"
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

// Virtual to handle both old and new field names
addressSchema.virtual('displayZip').get(function() {
  return this.zipCode || this.zip;
});

addressSchema.virtual('displayPhone').get(function() {
  return this.phone || this.num;
});

const Address = mongoose.model("Address", addressSchema);
export default Address;