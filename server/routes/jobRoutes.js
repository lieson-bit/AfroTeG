const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const jobController = require("../controllers/jobController");

const router = express.Router();

router.post("/", protect, jobController.createJob); // 📌 Create a job
router.get("/", jobController.getAllJobs); // 📌 Get all jobs
//router.get("/:id", jobController.getJobById); // 📌 Get a single job
router.post("/:id/apply", protect, jobController.applyForJob); // 📌 Apply for a job
router.post("/:jobId/applications/:applicationId/respond", protect, jobController.respondToMessage); // 📌 Client responds to freelancer
router.put("/:jobId", protect, jobController.updateJob); // 📌 Client updates job
router.delete("/:jobId/applications/:applicationId", protect, jobController.deleteApplication); // 📌 Delete an application
router.get('/:jobId', jobController.getJobDetails); // The route to get job details
router.get("/by-client", protect, jobController.getJobsByClient);
router.delete("/:jobId", protect, jobController.deleteJob);
router.get(
    "/:jobId/applications/:applicationId/messages", 
    protect, 
    jobController.getApplicationMessages
  );
module.exports = router;
