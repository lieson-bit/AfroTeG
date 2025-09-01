const reviewSchema = mongoose.Schema({
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
