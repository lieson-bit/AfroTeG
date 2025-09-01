import HeadTag from "../../components/HeadTag";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginSignupHeader from "../../components/LoginSignupHeader";
import { useAuth } from "../../context/AuthContext";
import LoginSignupFooter from "../../components/LoginSignupFooter";
import CommunicationPanel from "../../components/CommunicationPanel";
import ApplicationDetailView from '../../components/ApplicationDetailView';

const Projects = () => {
    const router = useRouter();
    const { id } = router.query; // Get client ID from URL
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("job");
    const [loading, setLoading] = useState(false);
    const [clientData, setClientData] = useState(null);
    const [isCurrentClient, setIsCurrentClient] = useState(false);
    const [clientJobs, setClientJobs] = useState([]);
    const [clientCompetitions, setClientCompetitions] = useState([]);
    const [editMode, setEditMode] = useState({ job: null, competition: null });
    const [selectedApplication, setSelectedApplication] = useState({
        application: null,
        jobId: null
      });
      const [refreshKey, setRefreshKey] = useState(0);
    // Add this with your other state declarations
    const [newMessage, setNewMessage] = useState('');

    // Get userId from localStorage (client-side only)
    const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    pricingType: "Fixed Price",
    difficultyLevel: "Intermediate",
    skillsRequired: [],
    category: "",
    currentSkill: ""
  });

  // Competition form state
  const [competitionForm, setCompetitionForm] = useState({
    title: "",
    description: "",
    prizeAmount: "",
    startDate: "",
    endDate: "",
    skillsRequired: [],
    judgingCriteria: [],
    rules: [],
    currentSkill: "",
    currentCriterion: "",
    currentRule: ""
  });

  // Handle job form submission
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/jobs",
        {
          ...jobForm,
          client: user._id,
          skillsRequired: jobForm.skillsRequired,
          status: "Open"
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.success("Job posted successfully!");
      setJobForm({
        title: "",
        description: "",
        budget: "",
        pricingType: "Fixed Price",
        difficultyLevel: "Intermediate",
        skillsRequired: [],
        category: "",
        currentSkill: ""
      });
    } catch (error) {
      toast.error("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  // Handle competition form submission
  const handleCompetitionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/competitions",
        {
          ...competitionForm,
          client: user._id,
          skillsRequired: competitionForm.skillsRequired,
          status: "Upcoming"
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Add the new competition to the list
      setClientCompetitions([...clientCompetitions, response.data]);
      
      toast.success("Competition created successfully!");
      setCompetitionForm({
        title: "",
        description: "",
        prizeAmount: "",
        startDate: "",
        endDate: "",
        skillsRequired: [],
        judgingCriteria: [],
        rules: [],
        currentSkill: "",
        currentCriterion: "",
        currentRule: ""
      });
    } catch (error) {
      toast.error("Failed to create competition");
    } finally {
      setLoading(false);
    }
  };

  // Add skill to job form
  const addJobSkill = () => {
    if (jobForm.currentSkill.trim() && !jobForm.skillsRequired.includes(jobForm.currentSkill.trim())) {
      setJobForm({
        ...jobForm,
        skillsRequired: [...jobForm.skillsRequired, jobForm.currentSkill.trim()],
        currentSkill: ""
      });
    }
  };

  // Remove skill from job form
  const removeJobSkill = (skill) => {
    setJobForm({
      ...jobForm,
      skillsRequired: jobForm.skillsRequired.filter(s => s !== skill)
    });
  };

  // Add skill to competition form
  const addCompetitionSkill = () => {
    if (competitionForm.currentSkill.trim() && !competitionForm.skillsRequired.includes(competitionForm.currentSkill.trim())) {
      setCompetitionForm({
        ...competitionForm,
        skillsRequired: [...competitionForm.skillsRequired, competitionForm.currentSkill.trim()],
        currentSkill: ""
      });
    }
  };

  // Remove skill from competition form
  const removeCompetitionSkill = (skill) => {
    setCompetitionForm({
      ...competitionForm,
      skillsRequired: competitionForm.skillsRequired.filter(s => s !== skill)
    });
  };

  // Add judging criterion to competition form
  const addJudgingCriterion = () => {
    if (competitionForm.currentCriterion.trim() && !competitionForm.judgingCriteria.includes(competitionForm.currentCriterion.trim())) {
      setCompetitionForm({
        ...competitionForm,
        judgingCriteria: [...competitionForm.judgingCriteria, competitionForm.currentCriterion.trim()],
        currentCriterion: ""
      });
    }
  };

  // Remove judging criterion from competition form
  const removeJudgingCriterion = (criterion) => {
    setCompetitionForm({
      ...competitionForm,
      judgingCriteria: competitionForm.judgingCriteria.filter(j => j !== criterion)
    });
  };

  // Add rule to competition form
  const addRule = () => {
    if (competitionForm.currentRule.trim() && !competitionForm.rules.includes(competitionForm.currentRule.trim())) {
      setCompetitionForm({
        ...competitionForm,
        rules: [...competitionForm.rules, competitionForm.currentRule.trim()],
        currentRule: ""
      });
    }
  };

  // Remove rule from competition form
  const removeRule = (rule) => {
    setCompetitionForm({
      ...competitionForm,
      rules: competitionForm.rules.filter(r => r !== rule)
    });
  };

  // Remove the client data fetch useEffect entirely

// Keep only this useEffect for projects
useEffect(() => {
  if (id && user && user.role === "client") {
    const isOwner = user._id === id;
    setIsCurrentClient(isOwner);

    if (!isOwner) return;

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch jobs posted by this client
        const jobsRes = await axios.get(
          `http://localhost:4000/api/jobs?clientId=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Enrich each job's applications with freelancer profile and user info
        const jobsWithFreelancers = await Promise.all(
          jobsRes.data.map(async (job) => {
            if (!job.applications || job.applications.length === 0) return job;

            const applicationsWithFreelancers = await Promise.all(
              job.applications.map(async (app) => {
                try {
                  let freelancerProfile = null;
                  let freelancerUser = null;

                  // Try to fetch from /api/profile for display name (used in the list)
                  try {
                    const profileRes = await axios.get(
                      `http://localhost:4000/api/profile/${app.freelancer}`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    freelancerProfile = profileRes.data;
                  } catch (profileError) {
                    console.warn("Profile not found, continuing...");
                  }

                  // Always fetch from /api/users for full user info (used in chat)
                  try {
                    const userRes = await axios.get(
                      `http://localhost:4000/api/users/${app.freelancer}`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    freelancerUser = userRes.data.user || userRes.data;
                  } catch (userError) {
                    console.warn("User data fetch failed");
                  }

                  return {
                    ...app,
                    freelancerProfile,  // For list display
                    freelancerUser      // For detailed view
                  };
                } catch (error) {
                  console.error("Error enriching application:", error);
                  return app;
                }
              })
            );

            return { ...job, applications: applicationsWithFreelancers };
          })
        );

        setClientJobs(jobsWithFreelancers);

        // Fetch competitions too
        const competitionsRes = await axios.get(
          `http://localhost:4000/api/competitions/my-competitions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClientCompetitions(competitionsRes.data);

      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }
}, [id, user, refreshKey]);



  // Add these functions for handling edits and deletes
const handleEditJob = (job) => {
    setEditMode({ job: job._id, competition: null });
    setJobForm({
      title: job.title,
      description: job.description || "",
      budget: job.budget,
      pricingType: job.pricingType,
      difficultyLevel: job.difficultyLevel,
      skillsRequired: job.skillsRequired || [],
      category: job.category || "",
      currentSkill: ""
    });
    setActiveTab("job");
  };

  const handleEditCompetition = (competition) => {
    setEditMode({ job: null, competition: competition._id });
    setCompetitionForm({
      title: competition.title,
      description: competition.description,
      prizeAmount: competition.prizeAmount,
      startDate: competition.startDate.split('T')[0],
      endDate: competition.endDate.split('T')[0],
      skillsRequired: competition.skillsRequired,
      judgingCriteria: competition.judgingCriteria,
      rules: competition.rules,
      currentSkill: "",
      currentCriterion: "",
      currentRule: ""
    });
    setActiveTab("competition");
  };
  
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:4000/api/jobs/${jobId}`,  // Updated endpoint
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setClientJobs(clientJobs.filter(job => job._id !== jobId));
        toast.success("Job deleted successfully");
      } catch (error) {
        console.error("Delete error:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to delete job");
      }
    }
  };

  const handleDeleteCompetition = async (competitionId) => {
    if (window.confirm("Are you sure you want to delete this competition?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:4000/api/competitions/${competitionId}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setClientCompetitions(clientCompetitions.filter(comp => comp._id !== competitionId));
        toast.success("Competition deleted successfully");
      } catch (error) {
        console.error("Delete error:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to delete competition");
      }
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/jobs/${editMode.job}`,
        {
          ...jobForm,
          skillsRequired: jobForm.skillsRequired || [] // Ensure array
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Update the UI immediately
      setClientJobs(clientJobs.map(job => 
        job._id === editMode.job ? response.data.job : job
      ));
      
      // Reset form and exit edit mode
      setEditMode({ job: null, competition: null });
      setJobForm({
        title: "",
        description: "",
        budget: "",
        pricingType: "Fixed Price",
        difficultyLevel: "Intermediate",
        skillsRequired: [],
        category: "",
        currentSkill: ""
      });
      
      toast.success("Job updated successfully");
    } catch (error) {
      console.error("Update error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  // Add this function to your Projects component
    const handleSelectApplication = (application) => {
    setSelectedApplication(application._id);
  };

  const handleViewApplication = (app, jobId) => {
    setSelectedApplication({
      application: app,
      jobId: jobId || id // Use provided jobId or fallback to the route id
    });
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedApplication(null);
  };
  
  const handleUpdateCompetition = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/competitions/${editMode.competition}`,
        competitionForm,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Update the competition in the list
      setClientCompetitions(clientCompetitions.map(comp => 
        comp._id === editMode.competition ? response.data : comp
      ));
      
      setEditMode({ job: null, competition: null });
      setCompetitionForm({
        title: "",
        description: "",
        prizeAmount: "",
        startDate: "",
        endDate: "",
        skillsRequired: [],
        judgingCriteria: [],
        rules: [],
        currentSkill: "",
        currentCriterion: "",
        currentRule: ""
      });
      toast.success("Competition updated successfully");
    } catch (error) {
      console.error("Update error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update competition");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "client") {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <HeadTag title="Access Denied - AfroTeG" />
        <LoginSignupHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-[#0C4A6E] mb-4">Access Denied</h1>
            <p className="text-zinc-600 mb-6">Only clients can access this page.</p>
            <button
              onClick={() => router.push("/")}
              className="py-2 px-5 font-semibold bg-[#0C4A6E] text-white rounded-full transition hover:bg-[#18465f]"
            >
              Go to Home
            </button>
          </div>
        </main>
        <LoginSignupFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ============== Head Tag =============== */}
      <HeadTag title="Post Projects - AfroTeG" />

      {/* ================= Header ================= */}
      <header className="header-bg">
        <Navbar/>
      </header>
        <br/><br/>
      {/* ================= Main ==================== */}
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
       {/* Left Side - Applications List (always visible) */}
       <div className={`${selectedApplication?.application ? 'lg:w-5/5' : 'lg:w-5/5'} w-full`}>
       <div className="lg:w-5/5 w-full">
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Job Applications</h3>
      {clientJobs.length > 0 ? (
        clientJobs.map(job => (
          <div key={job._id} className="mb-4">
            <h4 className="font-medium text-gray-800">{job.title}</h4>
            {job.applications?.length > 0 ? (
              <div className="ml-4 mt-2">
                {job.applications.map(app => {
                  const freelancerProfile = app.freelancerProfile || {};
                  const freelancerName = freelancerProfile.firstName 
                    ? `${freelancerProfile.firstName} ${freelancerProfile.lastName || ''}`.trim()
                    : 'Freelancer';
                  
                  return (
                    <div 
                      key={app._id} 
                      className={`p-3 mb-2 rounded-lg cursor-pointer border transition-all ${
                        selectedApplication?.application?._id === app._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleViewApplication(app, job._id)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-sm font-medium">
                          {freelancerName.split(' ').map(n => n[0]).join('').toUpperCase() || 'F'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {freelancerName}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                            <span className="text-xs text-gray-500">
                              Bid: ${app.bidAmount}
                            </span>
                            <span className="text-xs text-gray-500">
                              • {app.messages?.length || 0} messages
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="ml-4 text-gray-500 text-sm">No applications yet</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">You haven't posted any jobs yet</p>
      )}
    </div>
  </div>
       </div>
  

  {/* Right Side - Communication Panel (only visible when application selected) */}
  {selectedApplication?.application ? (
    <div className="lg:w-5/5 w-full">
      <ApplicationDetailView 
        application={selectedApplication.application}
        onBack={() => setSelectedApplication(null)}
        jobId={selectedApplication.jobId}
        userId={userId}
        onMessageSent={() => setRefreshKey(prev => prev + 1)}
      />
    </div>
  ) : null}

  {/* Form Section */}
  <div className={`${selectedApplication?.application ? 'lg:w-5/5' : 'lg:w-5/3'} w-full`}>
  <div className="lg:w-8/7 w-full">
        

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex border border-[#0C4A6E] rounded-full overflow-hidden">
            <button
              className={`py-2 px-6 font-medium ${activeTab === "job" ? "bg-[#0C4A6E] text-white" : "text-[#0C4A6E] hover:bg-gray-100"}`}
              onClick={() => setActiveTab("job")}
            >
              Post Job
            </button>
            <button
              className={`py-2 px-6 font-medium ${activeTab === "competition" ? "bg-[#0C4A6E] text-white" : "text-[#0C4A6E] hover:bg-gray-100"}`}
              onClick={() => setActiveTab("competition")}
            >
              Create Competition
            </button>
          </div>
        </div>

        {/* Job Posting Form */}
        {activeTab === "job" && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[#0C4A6E] mb-4">Post a Job Vacancy</h2>
            <form onSubmit={handleJobSubmit}>
              <div className="mb-4">
                <label className="block text-zinc-700 mb-2" htmlFor="job-title">
                  Job Title*
                </label>
                <input
                  id="job-title"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-zinc-700 mb-2" htmlFor="job-description">
                  Description*
                </label>
                <textarea
                  id="job-description"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="5"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-zinc-700 mb-2" htmlFor="job-budget">
                    Budget*
                  </label>
                  <input
                    id="job-budget"
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={jobForm.budget}
                    onChange={(e) => setJobForm({ ...jobForm, budget: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 mb-2" htmlFor="job-pricingType">
                    Pricing Type*
                  </label>
                  <select
                    id="job-pricingType"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={jobForm.pricingType}
                    onChange={(e) => setJobForm({ ...jobForm, pricingType: e.target.value })}
                    required
                  >
                    <option value="Fixed Price">Fixed Price</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-zinc-700 mb-2" htmlFor="job-difficulty">
                    Difficulty Level*
                  </label>
                  <select
                    id="job-difficulty"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={jobForm.difficultyLevel}
                    onChange={(e) => setJobForm({ ...jobForm, difficultyLevel: e.target.value })}
                    required
                  >
                    <option value="Entry">Entry Level</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 mb-2" htmlFor="job-category">
                    Category*
                  </label>
                  <input
                    id="job-category"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={jobForm.category}
                    onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-zinc-700 mb-2" htmlFor="job-skills">
                  Required Skills
                </label>
                <div className="flex mb-2">
                  <input
                    id="job-skills"
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                    value={jobForm.currentSkill}
                    onChange={(e) => setJobForm({ ...jobForm, currentSkill: e.target.value })}
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    className="bg-[#0C4A6E] text-white px-4 rounded-r-lg hover:bg-[#18465f]"
                    onClick={addJobSkill}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobForm.skillsRequired.map((skill) => (
                    <div key={skill} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => removeJobSkill(skill)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-6">
                {/* This is in the JOB FORM - UPDATE THIS BUTTON */}
                <button
                  type="submit"
                  className="py-2 px-5 font-semibold bg-[#0C4A6E] text-white        rounded-full       transition hover:bg-[#18465f] disabled:opacity-50"
                  disabled={loading}
                  onClick={editMode.job ? handleUpdateJob : handleJobSubmit}
                >
                  {loading ? "Processing..." : editMode.job ? "Update Job" : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Add this below the job form */}
        {activeTab === "job" && clientJobs.length > 0 && (
          <div className="max-w-2xl mx-auto mt-8">
            <h3 className="text-xl font-semibold text-[#0C4A6E] mb-4">Your Posted Jobs</h3>
            <div className="space-y-4">
              {clientJobs.map(job => (
                <div key={job._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">{job.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">
                         {job.description ? job.description.substring(0, 100) + "..." : "No description provided"}
                        </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(job.skillsRequired || []).map(skill => (
                          <span key={skill} className="bg-gray-100 px-2 py-1 rounded-full       text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        

        {/* Competition Creation Form */}
{activeTab === "competition" && (
  <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-[#0C4A6E] mb-4">
      {editMode.competition ? "Update Your Competition" : "Create a Competition"}
    </h2>
    <form onSubmit={editMode.competition ? handleUpdateCompetition : handleCompetitionSubmit}>
      <div className="mb-4">
        <label className="block text-zinc-700 mb-2" htmlFor="competition-title">
          Competition Title*
        </label>
        <input
          id="competition-title"
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={competitionForm.title}
          onChange={(e) => setCompetitionForm({ ...competitionForm, title: e.target.value })}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-zinc-700 mb-2" htmlFor="competition-description">
          Description*
        </label>
        <textarea
          id="competition-description"
          className="w-full p-2 border border-gray-300 rounded-lg"
          rows="5"
          value={competitionForm.description}
          onChange={(e) => setCompetitionForm({ ...competitionForm, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-zinc-700 mb-2" htmlFor="competition-prize">
            Prize Amount ($)*
          </label>
          <input
            id="competition-prize"
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={competitionForm.prizeAmount}
            onChange={(e) => setCompetitionForm({ ...competitionForm, prizeAmount: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-zinc-700 mb-2" htmlFor="competition-startDate">
            Start Date*
          </label>
          <input
            id="competition-startDate"
            type="date"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={competitionForm.startDate}
            onChange={(e) => setCompetitionForm({ ...competitionForm, startDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-zinc-700 mb-2" htmlFor="competition-endDate">
            End Date*
          </label>
          <input
            id="competition-endDate"
            type="date"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={competitionForm.endDate}
            onChange={(e) => setCompetitionForm({ ...competitionForm, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-zinc-700 mb-2" htmlFor="competition-skills">
          Required Skills
        </label>
        <div className="flex mb-2">
          <input
            id="competition-skills"
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-lg"
            value={competitionForm.currentSkill}
            onChange={(e) => setCompetitionForm({ ...competitionForm, currentSkill: e.target.value })}
            placeholder="Add a skill"
          />
          <button
            type="button"
            className="bg-[#0C4A6E] text-white px-4 rounded-r-lg hover:bg-[#18465f]"
            onClick={addCompetitionSkill}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {competitionForm.skillsRequired.map((skill) => (
            <div key={skill} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <span>{skill}</span>
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeCompetitionSkill(skill)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-zinc-700 mb-2" htmlFor="competition-criteria">
          Judging Criteria*
        </label>
        <div className="flex mb-2">
          <input
            id="competition-criteria"
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-lg"
            value={competitionForm.currentCriterion}
            onChange={(e) => setCompetitionForm({ ...competitionForm, currentCriterion: e.target.value })}
            placeholder="Add a criterion"
            required={competitionForm.judgingCriteria.length === 0}
          />
          <button
            type="button"
            className="bg-[#0C4A6E] text-white px-4 rounded-r-lg hover:bg-[#18465f]"
            onClick={addJudgingCriterion}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {competitionForm.judgingCriteria.map((criterion) => (
            <div key={criterion} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <span>{criterion}</span>
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeJudgingCriterion(criterion)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-zinc-700 mb-2" htmlFor="competition-rules">
          Competition Rules
        </label>
        <div className="flex mb-2">
          <input
            id="competition-rules"
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-lg"
            value={competitionForm.currentRule}
            onChange={(e) => setCompetitionForm({ ...competitionForm, currentRule: e.target.value })}
            placeholder="Add a rule"
          />
          <button
            type="button"
            className="bg-[#0C4A6E] text-white px-4 rounded-r-lg hover:bg-[#18465f]"
            onClick={addRule}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {competitionForm.rules.map((rule) => (
            <div key={rule} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <span>{rule}</span>
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeRule(rule)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          type="submit"
          className="py-2 px-5 font-semibold bg-[#0C4A6E] text-white rounded-full transition hover:bg-[#18465f] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : editMode.competition ? "Update Competition" : "Create Competition"}
        </button>
        {editMode.competition && (
          <button
            type="button"
            className="py-2 px-5 font-semibold bg-gray-200 text-gray-700 rounded-full transition hover:bg-gray-300 ml-4"
            onClick={() => {
              setEditMode({ job: null, competition: null });
              setCompetitionForm({
                title: "",
                description: "",
                prizeAmount: "",
                startDate: "",
                endDate: "",
                skillsRequired: [],
                judgingCriteria: [],
                rules: [],
                currentSkill: "",
                currentCriterion: "",
                currentRule: ""
              });
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  </div>
)}

{/* Client's Competitions List */}
{activeTab === "competition" && clientCompetitions.length > 0 && (
  <div className="max-w-2xl mx-auto mt-8">
    <h3 className="text-xl font-semibold text-[#0C4A6E] mb-4">Your Competitions</h3>
    <div className="space-y-4">
      {clientCompetitions.map(competition => (
        <div key={competition._id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-lg">{competition.title}</h4>
              <p className="text-gray-600 text-sm mt-1">
                {competition.description?.substring(0, 100) || "No description provided"}
                {competition.description?.length > 100 && "..."}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm font-medium mr-2">
                  Prize: ${competition.prizeAmount}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  competition.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                  competition.status === 'Judging' ? 'bg-yellow-100 text-yellow-800' :
                  competition.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {competition.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {competition.skillsRequired?.map(skill => (
                  <span key={skill} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditCompetition(competition)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCompetition(competition._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* Empty State for Competitions */}
{activeTab === "competition" && clientCompetitions.length === 0 && (
  <div className="max-w-2xl mx-auto mt-8 text-center py-8">
    <h3 className="text-xl font-semibold text-[#0C4A6E] mb-2">No Competitions Yet</h3>
    <p className="text-gray-600">You haven't created any competitions. Create your first one above!</p>
  </div>
)}
</div>


</div>  
      </main>

      {/* ==================== Footer ====================== */}
      <LoginSignupFooter />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Projects;