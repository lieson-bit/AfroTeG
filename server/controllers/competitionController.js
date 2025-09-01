// controllers/competitionController.js
const Competition = require("../models/Competition");
const User = require("../models/users");
const { uploadFile } = require("../utils/fileUpload");

// Create a new competition
exports.createCompetition = async (req, res) => {
  try {
    const client = await User.findById(req.user.id);
    if (!client || client.role !== "client") {
      return res.status(403).json({ message: "Only clients can create competitions" });
    }

    const competitionData = {
      ...req.body,
      client: req.user.id
    };

    const competition = await Competition.create(competitionData);
    res.status(201).json(competition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all competitions
exports.getAllCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find()
      .populate("client", "firstName lastName profilePic")
      .sort({ createdAt: -1 });
      
    res.status(200).json(competitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single competition
exports.getCompetition = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id)
      .populate("client", "firstName lastName profilePic")
      .populate("submissions.freelancer", "firstName lastName profilePic")
      .populate("winner", "firstName lastName profilePic");

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    res.status(200).json(competition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update competition
exports.updateCompetition = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Only the client who created the competition can update it
    if (competition.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this competition" });
    }

    const updatedCompetition = await Competition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCompetition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete competition
exports.deleteCompetition = async (req, res) => {
    try {
      const competition = await Competition.findOneAndDelete({
        _id: req.params.id,
        client: req.user._id // Ensure only owner can delete
      });
      
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

// Submit to competition
exports.submitToCompetition = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Only freelancers can submit
    const freelancer = await User.findById(req.user.id);
    if (!freelancer || freelancer.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can submit to competitions" });
    }

    // Check if competition is still open
    if (competition.status !== "Ongoing") {
      return res.status(400).json({ message: "Competition is not currently accepting submissions" });
    }

    // Check if freelancer already submitted
    const existingSubmission = competition.submissions.find(
      sub => sub.freelancer.toString() === req.user.id
    );
    if (existingSubmission) {
      return res.status(400).json({ message: "You already submitted to this competition" });
    }

    // Handle file uploads
    const files = [];
    if (req.files) {
      for (const file of req.files) {
        const fileUrl = await uploadFile(file);
        files.push(fileUrl);
      }
    }

    const submission = {
      freelancer: req.user.id,
      files,
      description: req.body.description
    };

    competition.submissions.push(submission);
    await competition.save();

    res.status(201).json({ message: "Submission successful", competition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Select winner
exports.selectWinner = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Only the client who created the competition can select winner
    if (competition.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to select winner" });
    }

    // Check if competition is in judging phase
    if (competition.status !== "Judging") {
      return res.status(400).json({ message: "Competition is not in judging phase" });
    }

    const { submissionId, winnerStatus } = req.body;

    // Find the submission
    const submission = competition.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update submission status
    submission.status = winnerStatus;
    
    // If winner, set as competition winner
    if (winnerStatus === "Winner") {
      competition.winner = submission.freelancer;
      competition.status = "Completed";
    }

    await competition.save();
    res.status(200).json({ message: "Winner selected successfully", competition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In your competitionController.js
// controllers/competitionController.js
exports.getCompetitionsByClient = async (req, res) => {
    try {
      // Ensure the requesting user is a client
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can view their competitions" });
      }
  
      // Only return competitions for the currently logged-in client
      const competitions = await Competition.find({ client: req.user._id })
        .populate("client", "firstName lastName profilePic")
        .populate("submissions.freelancer", "firstName lastName profilePic")
        .populate("winner", "firstName lastName profilePic");
        
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Add to your competitionRoutes.js
  