// routes/competitionRoutes.js
const express = require("express");
const router = express.Router();
const competitionController = require("../controllers/competitionController");
const { protect } = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

// Competition CRUD
router.get("/my-competitions", protect, competitionController.getCompetitionsByClient); // Changed from /by-client
router.post("/", protect, competitionController.createCompetition);
router.get("/", competitionController.getAllCompetitions);
router.get("/:id", competitionController.getCompetition);
router.put("/:id", protect, competitionController.updateCompetition);
router.delete("/:id", protect, competitionController.deleteCompetition);

// Submission routes
router.post(
  "/:id/submit", 
  protect, 
  uploadMiddleware.array("files", 5), // Max 5 files
  competitionController.submitToCompetition
);

// Winner selection
router.post("/:id/select-winner", protect, competitionController.selectWinner);

module.exports = router;