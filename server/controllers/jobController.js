const Job = require("../models/Job");
const User = require("../models/users");

// 📌 POST: Create a new job
exports.createJob = async (req, res) => {
  try {
    const { title, description, budget, pricingType, difficultyLevel, skillsRequired, category } = req.body;

    if (!req.user || req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can post jobs" });
    }

    const newJob = new Job({
      title,
      description,
      client: req.user._id,
      budget,
      pricingType,
      difficultyLevel,
      skillsRequired,
      category,
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// In jobController.js
exports.getAllJobs = async (req, res) => {
  try {
    const query = req.query.clientId ? { client: req.query.clientId } : {};
    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// 📌 GET: Fetch a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("client", "firstName lastName profilePic country");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 📌 POST: Apply for a job (Max 2 applications)
exports.applyForJob = async (req, res) => {
    try {
      const { proposal, bidAmount } = req.body;
  
      if (!req.user || req.user.role !== "freelancer") {
        return res.status(403).json({ message: "Only freelancers can apply for jobs" });
      }
  
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
  
      // Get all applications by the freelancer
      const freelancerApplications = job.applications.filter(app => app.freelancer.toString() === req.user._id.toString());
  
      if (freelancerApplications.length >= 3) {
        return res.status(400).json({ message: "You can only have up to 2 applications at a time" });
      }
  
      // Add new application
      job.applications.push({
        freelancer: req.user._id,
        proposal,
        bidAmount,
        status: "Pending",
      });
  
      await job.save();
      res.status(200).json({ message: "Application submitted successfully", job });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  

  // 📌 DELETE: Remove freelancer's application
exports.deleteApplication = async (req, res) => {
    try {
      const { jobId, applicationId } = req.params;
  
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });
  
      const applicationIndex = job.applications.findIndex(app => app._id.toString() === applicationId);
  
      if (applicationIndex === -1) {
        return res.status(404).json({ message: "Application not found" });
      }
  
      // Ensure the freelancer deleting the application is the owner
      if (job.applications[applicationIndex].freelancer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to delete this application" });
      }
  
      // Remove application
      job.applications.splice(applicationIndex, 1);
      await job.save();
  
      res.status(200).json({ message: "Application deleted successfully", job });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

  exports.deleteJob = async (req, res) => {
    try {
      const job = await Job.findOneAndDelete({
        _id: req.params.jobId,
        client: req.user._id // Ensure only owner can delete
      });
  
      if (!job) {
        return res.status(404).json({ 
          message: "Job not found or you don't have permission" 
        });
      }
  
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ 
        message: "Server Error", 
        error: error.message 
      });
    }
  };
  
  
 // 📌 Update Job Details (Client Only)
exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { 
      title, 
      description, 
      budget, 
      status,
      pricingType,
      difficultyLevel,
      skillsRequired,
      category
    } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Ensure only the client who created the job can update it
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this job" });
    }

    // Update all fields
    job.title = title || job.title;
    job.description = description || job.description;
    job.budget = budget || job.budget;
    job.status = status || job.status;
    job.pricingType = pricingType || job.pricingType;
    job.difficultyLevel = difficultyLevel || job.difficultyLevel;
    job.skillsRequired = skillsRequired || job.skillsRequired || [];  // Ensure array
    job.category = category || job.category;

    const updatedJob = await job.save();
    res.status(200).json({ 
      message: "Job updated successfully", 
      job: updatedJob 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
};

  // Example of fetching a job by its ID and populating the client field
exports.getJobDetails = async (req, res) => {
        try {
          const jobId = req.params.jobId; // Extract jobId from request parameters
        
          const job = await Job.findById(jobId)
            .populate('client')  // Populate the client field to include full user data
            .exec();
        
          if (!job) {
            return res.status(404).json({ message: 'Job not found' });
          }
      
        // Ensure profilePic uses forward slashes
        if (job.client.profilePic) {
            job.client.profilePic = job.client.profilePic.replace(/\\/g, '/'); // Replacing backslashes with forward slashes
          }

          return res.json({ job }); // Return the job data including populated client
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error' });
        }
};

    // In your jobController.js
    exports.getJobsByClient = async (req, res) => {
      try {
        const jobs = await Job.find({ client: req.user._id })
          .populate({
            path: 'applications',
            populate: {
              path: 'freelancer',
              select: 'firstName lastName email country'
            }
          })
          .exec();
        res.json(jobs);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
  // Add this new controller method for getting messages
  exports.getApplicationMessages = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate('client', 'firstName lastName')
      .populate('applications.freelancer', 'firstName lastName')
      .populate('applications.messages.sender', 'firstName lastName');

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = job.applications.id(req.params.applicationId);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify the requesting user is either the client or freelancer
    const isClient = req.user._id.toString() === job.client._id.toString();
    const isFreelancer = req.user._id.toString() === application.freelancer._id.toString();
    
    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({
      messages: application.messages,
      success: true
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

// Update your respondToMessage controller
exports.respondToMessage = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = job.applications.id(req.params.applicationId);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Add new message
    application.messages.push({
      sender: req.user._id,
      message: req.body.message
    });

    await job.save();

    // Populate sender info before returning
    const savedJob = await Job.findById(req.params.jobId)
      .populate('applications.messages.sender', 'firstName lastName');

    const savedApplication = savedJob.applications.id(req.params.applicationId);
    const newMessage = savedApplication.messages[savedApplication.messages.length - 1];

    res.status(201).json({
      message: newMessage,
      success: true
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};