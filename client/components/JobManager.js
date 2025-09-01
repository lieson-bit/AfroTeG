import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const JobManager = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); // For client responses
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  // ✅ Retrieve Token from localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    console.log(`🔍 Fetching job details for Job ID: ${jobId}`);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Job Details Fetched:", response.data);
      setJob(response.data.job);
    } catch (error) {
      console.error("❌ Error fetching job details:", error.response?.data || error);
      setError("Error fetching job details.");
    }
  };

  const handleApply = async () => {
    if (!proposal || !bidAmount) {
      setError("Please provide both a proposal and bid amount.");
      return;
    }

    if (job.applications.filter(app => app.freelancer === userId).length >= 2) {
      setError("You can only have up to 2 applications at a time.");
      return;
    }

    try {
      console.log(`📤 Applying for job (ID: ${jobId})`);
      setIsApplying(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/jobs/${jobId}/apply`,
        { proposal, bidAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Application Successful:", response.data);

      setIsApplying(false);
      setProposal("");
      fetchJobDetails(); // Refresh job details after applying
    } catch (err) {
      console.error("❌ Error applying for job:", err.response?.data || err);
      setError("Error submitting application.");
      setIsApplying(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    console.log(`🗑 Deleting Application ID: ${applicationId} from Job ID: ${jobId}`);
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/jobs/${jobId}/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Application Deleted Successfully:", response.data);
      fetchJobDetails(); // Refresh after deletion
    } catch (err) {
      console.error("❌ Error deleting application:", err.response?.data || err);
      setError("Error deleting application.");
    }
  };

  const handleSendResponse = async (applicationId) => {
    if (!responseMessage.trim()) {
      setError("Please enter a message");
      return;
    }

    try {
      console.log(`📩 Sending response to Application ID: ${applicationId}`);
      const response = await axios.post(
        `${API_BASE_URL}/api/jobs/${jobId}/applications/${applicationId}/respond`,
        { message: responseMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Response Sent Successfully:", response.data);
      setResponseMessage("");
      fetchJobDetails(); // Refresh to show new message
    } catch (err) {
      console.error("❌ Error sending response:", err.response?.data || err);
      setError("Error sending response.");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!job) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      <JobDetails job={job} />
      
      {/* Applications Section */}
      <div>
        <h2 className="text-xl font-semibold">Freelancer Applications</h2>
        {job.applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          job.applications.map((application) => (
            <ApplicationDetails 
              key={application._id} 
              application={application} 
              onDelete={handleDeleteApplication}
              onSendResponse={handleSendResponse}
              userId={userId}
              clientId={job.client._id}
            />
          ))
        )}
      </div>

      {/* Apply for Job Section */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold">Apply for this Job</h2>
        <textarea
          className="w-full p-2 mt-2 border rounded-md"
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Enter your proposal..."
        />
        <input
          type="number"
          className="w-full p-2 mt-2 border rounded-md"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Bid Amount"
        />
        <button
          onClick={handleApply}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isApplying ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
};

const JobDetails = ({ job }) => {
  const [profilePic, setProfilePic] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (job.client.profilePic) {
      const fetchImage = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/${job.client.profilePic}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
          });
          const imageBlob = URL.createObjectURL(response.data);
          setProfilePic(imageBlob);
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      };
      fetchImage();
    }
  }, [job.client.profilePic, token, API_BASE_URL]);

  return (
    <div>
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="mt-2 text-gray-600">{job.description}</p>
      <p className="mt-1"><strong>Budget:</strong> ${job.budget}</p>
      <p className="mt-1"><strong>Difficulty:</strong> {job.difficultyLevel}</p>
      <p className="mt-1"><strong>Category:</strong> {job.category}</p>

      <div className="mt-3 flex items-center">
        {profilePic ? (
          <img src={profilePic} alt="Client Profile" className="w-10 h-10 rounded-full mr-3" />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        )}
        <p><strong>Posted by:</strong> {job.client.firstName} {job.client.lastName} ({job.client.country})</p>
      </div>
    </div>
  );
};

const ApplicationDetails = ({ application, onDelete, onSendResponse, userId, clientId }) => {
  const [responseMessage, setResponseMessage] = useState("");
  const isClient = userId === clientId;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold">Freelancer's Proposal:</h3>
      <p className="text-gray-700">{application.proposal}</p>
      <p className="mt-1"><strong>Bid Amount:</strong> ${application.bidAmount}</p>
      <p className="mt-1"><strong>Status:</strong> {application.status}</p>
      
      {/* Messages Section */}
      {application.messages && application.messages.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="font-medium text-gray-800">Response:</h4>
          <div className="space-y-2">
            {application.messages.map((msg) => (
              <div 
                key={msg._id} 
                className={`flex ${msg.sender === clientId ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-xs p-3 rounded-lg ${msg.sender === clientId 
                    ? 'bg-blue-100 text-gray-800' 
                    : 'bg-green-100 text-gray-800'}`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Input (shown for client) */}
      {isClient && (
        <div className="mt-4">
          <textarea
            className="w-full p-2 border rounded-md"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Type your response..."
          />
          <div className="flex justify-between mt-2">
            <button
              onClick={() => {
                onSendResponse(application._id);
                setResponseMessage("");
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Send Response
            </button>
            <button
              onClick={() => onDelete(application._id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete Application
            </button>
          </div>
        </div>
      )}

      {/* Delete button (shown for freelancer) */}
      {!isClient && (
        <button
          onClick={() => onDelete(application._id)}
          className="mt-3 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete Application
        </button>
      )}
    </div>
  );
};

export default JobManager;