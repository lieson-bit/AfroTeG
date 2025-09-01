const categorySchema = mongoose.Schema({
    id: { type: String, required: true },
    alt: { type: String, required: true },
    text: { type: String, required: true },
    link: { type: String, required: true },
});

module.exports = mongoose.model('Category', categorySchema);
