import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    commissionRate: {
        type: Number,
        default: 15,
        min: [0, 'Commission rate cannot be negative'],
        max: [100, 'Commission rate cannot exceed 100']
    },
    deliveryFee: {
        type: Number,
        default: 5,
        min: [0, 'Delivery fee cannot be negative']
    },
    platformName: {
        type: String,
        default: 'SnapDish',
        trim: true,
        required: [true, 'Platform name is required']
    },
    supportEmail: {
        type: String,
        default: 'support@snapdish.com',
        trim: true,
        lowercase: true,
        required: [true, 'Support email is required'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for faster queries (since we only have one settings document)
settingsSchema.index({ createdAt: 1 });

// Virtual for checking if settings are default
settingsSchema.virtual('isDefault').get(function() {
    return this.commissionRate === 15 && 
           this.deliveryFee === 5 && 
           this.platformName === 'SnapDish';
});

// Pre-save hook to ensure values are within valid ranges
settingsSchema.pre('save', function(next) {
    if (this.commissionRate < 0) this.commissionRate = 0;
    if (this.commissionRate > 100) this.commissionRate = 100;
    if (this.deliveryFee < 0) this.deliveryFee = 0;
    
    next();
});

const settingsModel = mongoose.model('Settings', settingsSchema);

export default settingsModel;