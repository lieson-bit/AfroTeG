const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");
const { protect } = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const { getAllFreelancerPortfolios } = require("../controllers/portfolioController");


// 📌 Fetch all freelancer portfolios
router.get("/freelancers", portfolioController.getAllFreelancerPortfolios);

// 📌 Add a new portfolio project (Now supports image uploads)
router.post("/", protect, uploadMiddleware.array("images", 5), portfolioController.addPortfolio); 

// 📌 Update a portfolio project
router.put("/", protect, uploadMiddleware.array("images", 5), portfolioController.updatePortfolio);

// 📌 Delete a portfolio project
router.delete("/", protect, portfolioController.deletePortfolio);

// 📌 Get all portfolio projects for a freelancer
router.get("/:userId", protect, portfolioController.getPortfolios);



module.exports = router;
