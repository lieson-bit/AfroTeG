const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Enable _id for embedded documents
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: [
            "Development & IT",
            "Design & Creative",
            "Sales & Marketing",
            "Writing & Translation",
            "Admin & Customer Support",
            "Finance & Accounting",
            "Engineering & Architecture",
            "Legal"
        ],
        message: "{VALUE} is not a valid category. Allowed categories are: Development & IT, Design & Creative, Sales & Marketing, Writing & Translation, Admin & Customer Support, Finance & Accounting, Engineering & Architecture, Legal."
    },
    description: { type: String, required: true },
    projectUrl: { type: String, default: "" },
    budgetPrice: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    images: [{ type: String }], // Array to store multiple images
}, { timestamps: true });

module.exports = PortfolioSchema;