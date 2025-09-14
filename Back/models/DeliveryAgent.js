
import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    vehicle_number: { type: String, required: true },
    availability_status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    approval_status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    }
});

const deliveryAgentModel = mongoose.models.deliveryAgent || mongoose.model("deliveryAgent", deliveryAgentSchema);
export default deliveryAgentModel;