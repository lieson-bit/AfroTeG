// models/competition.js
const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  freelancer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  files: [{ 
    type: String, // URLs to submitted files
    required: true 
  }],
  description: { 
    type: String, 
    required: true 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Winner", "Runner-up", "Rejected"], 
    default: "Pending" 
  }
}, { _id: true });

const CompetitionSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    client: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true
    },
    prizeAmount: { 
      type: Number, 
      required: true 
    },
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
    skillsRequired: [{ 
      type: String, 
      required: true 
    }],
    judgingCriteria: [{ 
      type: String, 
      required: true 
    }],
    submissions: [SubmissionSchema],
    status: { 
      type: String, 
      enum: ["Upcoming", "Ongoing", "Judging", "Completed"], 
      default: "Upcoming" 
    },
    winner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    featuredImage: { 
      type: String // URL to competition banner
    },
    rules: [{ 
      type: String 
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

// Add validation for dates
CompetitionSchema.pre("save", function(next) {
  if (this.endDate <= this.startDate) {
    throw new Error("End date must be after start date");
  }
  
  // Update status based on dates
  const now = new Date();
  if (now < this.startDate) {
    this.status = "Upcoming";
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = "Ongoing";
  } else if (now > this.endDate && this.status !== "Completed") {
    this.status = "Judging";
  }
  
  next();
});

// Virtual for competition duration (in days)
CompetitionSchema.virtual("durationDays").get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model("Competition", CompetitionSchema);