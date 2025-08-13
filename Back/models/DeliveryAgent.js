import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const deliveryAgentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    password_hash: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'on_delivery', 'offline'],
        default: 'offline',
    },
    current_location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        }
    }
}, {
    timestamps: true
});

// Index for geospatial queries
deliveryAgentSchema.index({ current_location: '2dsphere' });

// Hash password before saving
deliveryAgentSchema.pre('save', async function (next) {
    if (!this.isModified('password_hash')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
});

// Method to compare password
deliveryAgentSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password_hash);
};

const DeliveryAgent = mongoose.model('DeliveryAgent', deliveryAgentSchema);
export default DeliveryAgent;