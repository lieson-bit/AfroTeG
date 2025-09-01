const mongoose = require('mongoose');
const PortfolioSchema = require('./Portfolio'); // Import Portfolio Schema

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["client", "freelancer"],
        required: true,
    },
    skills: [String],
    rating: {type: Number, default: 0},
    ratingCount: { type: Number, default: 0 },
    country: { type: String, required: true },
    profilePic: { type: String, default: "" },
    biography: { type: String, default: "" },
    portfolio: [PortfolioSchema], // Array of portfolio projects
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification',
        },
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    unreadMessages: {
        type: Number,
        default: 0
      },
      messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      }],
    conversations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
