const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to client
    budget: { type: Number, required: true },
    pricingType: { type: String, enum: ["Fixed Price", "Hourly"], required: true },
    difficultyLevel: { type: String, enum: ["Entry", "Intermediate", "Expert"], required: true },
    skillsRequired: [{ type: String, required: true }],
    category: { type: String, required: true },
    status: { type: String, enum: ["Open", "In Progress", "Completed"], default: "Open" }, // Job status
    applications: [
      {
        freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        proposal: { type: String, required: true },
        bidAmount: { type: Number, required: true },
        status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
        messages: [
          {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Freelancer or Client
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
          }
        ]
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
