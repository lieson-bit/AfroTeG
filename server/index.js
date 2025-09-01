require("dotenv").config(); // Load environment variables FIRST
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
require("./middlewares/authMiddleware"); // Google OAuth setup

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes"); // Add profile routes
const portfolioRoutes = require("./routes/portfolioRoutes"); 
const jobRoutes = require("./routes/jobRoutes"); // Import job routes
const competitionRoutes = require("./routes/competitionRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Serve static files (for profile pictures)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/profile", profileRoutes); // Profile routes
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/ratings", ratingRoutes);
app.use('/api/messages', messageRoutes);

// Connect to MongoDB (Local)
mongoose
  .connect("mongodb://localhost:27017/freelanceconn", {
    serverSelectionTimeoutMS: 5000, // Adjust timeout for local MongoDB
  })
  .then(() => console.log("✅ Connected to the local MongoDB database"))
  .catch((err) => console.error("❌ Local database connection error:", err));


// Default Route
app.get("/", (req, res) => {
  res.json({ message: "Hello from the authentication server" });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));