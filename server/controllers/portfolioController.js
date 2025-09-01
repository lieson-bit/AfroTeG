const User = require("../models/users");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const path = require("path");


// 📌 Add a new portfolio project
exports.addPortfolio = async (req, res) => {
    try {
        const { name, category, description, projectUrl, budgetPrice } = req.body;

        // Get uploaded images from Multer
        const images = req.files ? req.files.map((file) => file.path) : [];

        // Check if the user is a freelancer
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "freelancer") {
            return res.status(403).json({ message: "Only freelancers can add portfolio projects" });
        }

        // Create a new portfolio project
        const newPortfolio = {
            name,
            category,
            description,
            projectUrl,
            budgetPrice,
            images, // Store image paths
        };

        // Add the project to the user's portfolio
        user.portfolio.push(newPortfolio);
        await user.save();

        // Get the newly added portfolio project with its _id
        const addedPortfolio = user.portfolio[user.portfolio.length - 1];

        res.status(201).json({ message: "Portfolio project added successfully", portfolio: addedPortfolio });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 📌 Update a portfolio project
exports.updatePortfolio = async (req, res) => {
    try {
        // Log request body and files before handling (this helps to debug)
        console.log("Request Body:", req.body);
        console.log("Uploaded Files:", req.files);

        const { portfolioId, userId, name, category, description, projectUrl, budgetPrice } = req.body;

        // Step 1: Verify that the authenticated user matches the userId in the request body
        if (!req.user || req.user.id !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this portfolio" });
        }

        // Step 2: Find the user (Freelancer) to update their portfolio
        const user = await User.findById(userId);
        if (!user || user.role !== "freelancer") {
            return res.status(403).json({ message: "Only freelancers can update portfolio projects" });
        }

        // Step 3: Verify that the portfolio exists (using the portfolioId)
        const portfolioProject = user.portfolio.id(portfolioId);
        if (!portfolioProject) {
            return res.status(404).json({ message: "Portfolio project not found" });
        }

        // Step 4: Update fields in the portfolio project if provided
        if (name) portfolioProject.name = name;
        if (category) portfolioProject.category = category;
        if (description) portfolioProject.description = description;
        if (projectUrl) portfolioProject.projectUrl = projectUrl;
        if (budgetPrice) portfolioProject.budgetPrice = budgetPrice;

        // Step 5: If there are uploaded images, update the portfolio images
        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map((file) => file.path); // Get file paths for images
            portfolioProject.images = imagePaths; // Assign new image paths
        }

        // Step 6: Save the updated user data with the modified portfolio
        await user.save();

        // Step 7: Respond with success message and updated portfolio
        res.status(200).json({ message: "Portfolio project updated successfully", portfolio: portfolioProject });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};




// 📌 Delete a portfolio project
exports.deletePortfolio = async (req, res) => {
    try {
        const { portfolioId } = req.body;

        // Check if the user is a freelancer
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "freelancer") {
            return res.status(403).json({ message: "Only freelancers can delete portfolio projects" });
        }

        // Remove the portfolio project
        user.portfolio.pull(portfolioId);
        await user.save();

        res.status(200).json({ message: "Portfolio project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// 📌 Get all portfolio projects for a specific user (freelancer)
exports.getPortfolios = async (req, res) => {
    try {
        const { userId } = req.params; // Get the userId from the request parameters

        // Find the user by ID
        const user = await User.findById(userId).select("portfolio role");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is a freelancer
        if (user.role !== "freelancer") {
            return res.status(400).json({ message: "This user is not a freelancer" });
        }

        // Return the freelancer's portfolio
        res.status(200).json({ portfolio: user.portfolio });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



exports.getAllFreelancerPortfolios = async (req, res) => {
    try {
      // Find all freelancers and populate their portfolios
      const freelancers = await User.find({ role: "freelancer" }, "portfolio").lean();
  
      // Extract portfolios from each freelancer
      const portfolios = freelancers.flatMap((user) => user.portfolio);
  
      res.status(200).json({ success: true, portfolios });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
