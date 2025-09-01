const User = require("../models/users");
const { uploadFile } = require("../utils/fileUpload");

// Fetch user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { firstName, lastName, biography, country } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (biography) user.biography = biography;
        if (country) user.country = country;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Upload profile picture
exports.uploadProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Upload file to cloud storage or local server
        const fileUrl = await uploadFile(req.file);
        user.profilePic = fileUrl;

        await user.save();
        res.status(200).json({ message: "Profile picture uploaded successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add this to profileController.js
exports.addSkill = async (req, res) => {
    try {
        const { skill } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.skills.includes(skill)) {
            user.skills.push(skill);
            await user.save();
        }

        res.status(200).json({ message: "Skill added successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.removeSkill = async (req, res) => {
    try {
        const { skill } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.skills = user.skills.filter(s => s !== skill);
        await user.save();

        res.status(200).json({ message: "Skill removed successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Add this to profileController.js
exports.getFreelancers = async (req, res) => {
    try {
      const freelancers = await User.aggregate([
        { $match: { role: 'freelancer' } },
        {
          $lookup: {
            from: 'ratings',
            localField: '_id',
            foreignField: 'freelancerId',
            as: 'ratings'
          }
        },
        {
          $addFields: {
            averageRating: { $avg: '$ratings.rating' }
          }
        },
        { $project: { password: 0, ratings: 0 } }
      ]);
      res.status(200).json(freelancers);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };