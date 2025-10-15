import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  cuisine: { type: String, required: true },
  price_for_two: { type: Number, required: true },
  status: { type: String, enum: ['active','inactive','pending_approval'], default:'pending_approval' },
  timing: { type: String },
  image: { type: String },
  
});

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);

export default restaurantModel;