import HeadTag from "../../components/HeadTag";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginSignupHeader from "../../components/LoginSignupHeader";
import { useAuth } from "../../context/AuthContext";
import LoginSignupFooter from "../../components/LoginSignupFooter";
import { FaPlus, FaTimes } from "react-icons/fa";

const Profile = () => {
  const router = useRouter();
  const { id } = router.query; // Get user ID from the URL
  const { user, setUser, profilePic, setProfilePic } = useAuth(); // Use AuthContext
  const [newSkill, setNewSkill] = useState("");


  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    biography: "",
    country: "",
  });

  // Fetch user data
  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:4000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); // Update user in AuthContext
          setFormData({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            biography: response.data.biography,
            country: response.data.country,
          });
          setProfilePic(response.data.profilePic); // Update profilePic in AuthContext
          setLoading(false);
        } catch (error) {
          toast.error("Failed to fetch user data");
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [id, setUser, setProfilePic]);

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:4000/api/profile/upload-profile-pic",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProfilePic(response.data.user.profilePic); // Update profilePic in AuthContext
        toast.success("Profile picture updated successfully");
      } catch (error) {
        toast.error("Failed to upload profile picture");
      }
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/profile/skills",
        { skill: newSkill.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh user data
      const response = await axios.get("http://localhost:4000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setNewSkill("");
      toast.success("Skill added successfully");
    } catch (error) {
      toast.error("Failed to add skill");
    }
  };
  
  const handleRemoveSkill = async (skill) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:4000/api/profile/skills", {
        headers: { Authorization: `Bearer ${token}` },
        data: { skill }
      });
      
      // Refresh user data
      const response = await axios.get("http://localhost:4000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      toast.success("Skill removed successfully");
    } catch (error) {
      toast.error("Failed to remove skill");
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:4000/api/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data.user); // Update user in AuthContext
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ============== Head Tag =============== */}
      <HeadTag
        title={`${user.firstName} ${user.lastName} | Profile - AfroTeG`}
      />

      {/* ================= Header ================= */}
      <header className="header-bg">
        <LoginSignupHeader />
      </header>

      {/* ================= Main ==================== */}
      <main className="container mx-auto py-8 lg:px-16 md:px-8 sm:px-6 px-4">
        <div className="flex flex-col lg:flex-row justify-center gap-12">

          {/* ================= Profile Info Section ================ */}
          <section className="flex flex-col items-center lg:w-1/3">
            <div className="w-40 h-40 relative mb-4">
              <Image
                src={
                  profilePic
                    ? `http://localhost:4000/${profilePic}` // Use profilePic from AuthContext
                    : "/images/logo.png" // Fallback default image
                }
                alt="Profile Picture"
                layout="fill"
                className="rounded-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <h1 className="text-3xl font-semibold text-[#0C4A6E] mt-4">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-xl text-zinc-700">{user.role === "freelancer" ? "Freelancer" : "Client"}</p>
            <p className="text-lg text-zinc-600">{user.country}</p>
          </section>

          {/* ================= Profile Bio Section ================ */}
            <section className="lg:w-2/4 w-full mx-auto">
              <h2 className="text-2xl font-semibold text-[#0C4A6E] mb-4">About Me</h2>
              {editMode ? (
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  value={formData.biography}
                  onChange={(e) =>
                    setFormData({ ...formData, biography: e.target.value })
                  }
                />
              ) : (
                <p className="text-zinc-600 mt-2">{user.biography || "No biography available."}</p>
              )}

              <div className="flex justify-center gap-4 mt-6">
                {editMode ? (
                  <button
                    className="py-2 px-5 font-semibold bg-[#0C4A6E] text-white rounded-full transition hover:bg-[#18465f]"
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    className="py-2 px-5 font-semibold bg-[#0C4A6E] text-white rounded-full transition hover:bg-[#18465f]"
                    onClick={() => setEditMode(true)}
                  >                                       
                    Edit Profile
                  </button>
                )}
              </div>
            </section>
        </div>
        
        {user.role === "freelancer" && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-[#0C4A6E] mb-4">Skills</h2>
            <div className="mb-4">
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                />
                <button
                  onClick={handleAddSkill}
                  className="bg-[#0C4A6E] text-white px-4 rounded-r-lg hover:bg-[#18465f] flex items-center"
                >
                  <FaPlus className="mr-1" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.skills?.map((skill, index) => (
                  <div key={index} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}               
        {/* ================= Ratings Section ================ */}
        {/* Only show ratings section for freelancers */}
        {user.role === "freelancer" && (
          <section className="mt-8 text-center">
            <h2 className="text-2xl font-semibold text-[#0C4A6E] mb-4">Ratings</h2>
            {user.ratingCount > 0 ? (
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${i < Math.round(user.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-zinc-600">
                  {user.rating.toFixed(1)} ({user.ratingCount} ratings)
                </p>
              </div>
            ) : (
              <p className="text-zinc-600">No ratings yet</p>
            )}
          </section>
        )}

                 
        <section className="text-center mt-8">
          {user.role === "client" ? (
            <button
              className="py-2 px-5 font-semibold bg-[#0C4A6E] text-white rounded-full transition hover:bg-[#18465f]"
              onClick={() => router.push(`/projects/${user._id}`)}
        
            >
              View Projects
            </button>
          ) : (
            <button
              className="py-2 px-5 font-semibold bg-[#0C4A6E] text-white rounded-full transition hover:bg-[#18465f]"
              onClick={() => router.push(`/portfolio/${user._id}`)} // Redirect to portfolio page
            >
              View Portfolio
            </button>
          )}
        </section>

      </main>

      {/* ==================== Footer ====================== */}
      <LoginSignupFooter />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Profile;
