import mongoose from 'mongoose';

const platformSchema = new mongoose.Schema({
    name: { type: String, required: true },
    handle: { type: String, required: true },
    followers: { type: String, required: true },
}, {_id: false});

const creatorApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    bio: { type: String, required: true },
    platforms: [platformSchema],
    contentStyle: [{ type: String }],
    bestPosts: [{ type: String }],
    proposal: { type: String, required: true },
    rates: { type: String },
    status: { type: String, default: 'Pending' },
    submittedAt: { type: Date, default: Date.now },
});

const CreatorApplication = mongoose.model('CreatorApplication', creatorApplicationSchema);

export default CreatorApplication;