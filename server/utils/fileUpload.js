const fs = require("fs");
const path = require("path");

const uploadFile = async (file) => {
    try {
        const filePath = path.join("uploads", file.filename); // Relative path for frontend to access
        return filePath; // Return the file path or URL
    } catch (error) {
        throw new Error("Failed to upload file");
    }
};

module.exports = { uploadFile };