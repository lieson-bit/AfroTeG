const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { protect } = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

// Fetch profile
router.get("/", protect, profileController.getProfile);

// Update profile
router.put("/", protect, profileController.updateProfile);

// Upload profile picture
router.post("/upload-profile-pic", protect, uploadMiddleware.single("file"), profileController.uploadProfilePic);
router.get("/:id", profileController.getUserById);

// Add these routes to profileRoutes.js
router.post("/skills", protect, profileController.addSkill);
router.delete("/skills", protect, profileController.removeSkill);

// Add this to profileRoutes.js
router.get("/freelancers/all", profileController.getFreelancers);


module.exports = router;