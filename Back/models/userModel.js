import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userAddressSchema = new mongoose.Schema({
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone_number: { type: String, required: true, unique: true },
    // Changed 'password_hash' to 'password' for clarity
    password: { type: String, required: true },
    role: {
        type: String,
        // Added the missing roles to support all user types
        enum: ['customer', 'admin', 'restaurant_owner', 'delivery_agent'],
        default: 'customer'
    },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    addresses: [userAddressSchema],
    favorite_restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    // Added cartData to store the user's cart
    cartData: { type: Object, default: {} }
}, { timestamps: true }); // Enabled `updatedAt` for better data tracking

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with the hashed password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;