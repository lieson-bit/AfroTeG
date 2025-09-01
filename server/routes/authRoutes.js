const express = require("express");
const passport = require("passport");
const { signup, login, getMe } = require("../controllers/authController"); // Import getMe
const { protect } = require("../middlewares/authMiddleware"); // Import protect middleware

const router = express.Router();

// 📌 Routes
router.post("/signup", signup);
router.post("/login", login);

// 📌 Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/auth?token=${req.user.token}`);
});

// 📌 Get Current User Data
router.get("/me", protect, getMe); // Add this route

module.exports = router;