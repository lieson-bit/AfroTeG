import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";

const PortfolioManager = ({ userId }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Development & IT",
    description: "",
    projectUrl: "",
    budgetPrice: 0,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  // Fetch all portfolios for the freelancer
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:4000/api/portfolio/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(response.data.portfolio);
    } catch (error) {
      console.error("Failed to fetch portfolio:", error.response?.data?.message || error.message);
    }
  };

  

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const formDataWithImages = new FormData();
        formDataWithImages.append("name", formData.name);
        formDataWithImages.append("category", formData.category);
        formDataWithImages.append("description", formData.description);
        formDataWithImages.append("projectUrl", formData.projectUrl);
        formDataWithImages.append("budgetPrice", formData.budgetPrice);

        // Append images properly
        formData.images.forEach((image) => {
            formDataWithImages.append("images", image); // 'images' matches the Multer field name
        });

        const response = await axios.post(
            "http://localhost:4000/api/portfolio",
            formDataWithImages,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        setPortfolio([...portfolio, response.data.portfolio]);
        setFormData({
            name: "",
            category: "Development & IT",
            description: "",
            projectUrl: "",
            budgetPrice: 0,
            images: [],
        });
        setError("");
    } catch (error) {
        console.error("Failed to add portfolio:", error.response?.data?.message || error.message);
        setError("Failed to add portfolio. Please try again.");
    } finally {
        setLoading(false);
    }
};


const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userId) {  // Use the prop directly
      setError("User is not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    try {
        const token = localStorage.getItem("token");

        const formDataWithImages = new FormData();
        formDataWithImages.append("portfolioId", selectedPortfolio._id);
        formDataWithImages.append("userId", userId);  // Use the prop instead of localStorage
        formDataWithImages.append("name", formData.name);
        formDataWithImages.append("category", formData.category);
        formDataWithImages.append("description", formData.description);
        formDataWithImages.append("projectUrl", formData.projectUrl);
        formDataWithImages.append("budgetPrice", formData.budgetPrice);

        console.log("User ID from props:", userId);

        // Append images properly
        formData.images.forEach((image) => {
            formDataWithImages.append("images", image);
        });

        const response = await axios.put(
            "http://localhost:4000/api/portfolio",
            formDataWithImages,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        setPortfolio(
            portfolio.map((p) =>
                p._id === selectedPortfolio._id ? response.data.portfolio : p
            )
        );
        setSelectedPortfolio(null);
        setFormData({
            name: "",
            category: "Development & IT",
            description: "",
            projectUrl: "",
            budgetPrice: 0,
            images: [],
        });
        setError("");
    } catch (error) {
        console.error("Failed to update portfolio:", error.response?.data?.message || error.message);
        setError("Failed to update portfolio. Please try again.");
    } finally {
        setLoading(false);
    }
};

  
  // Handle deleting a portfolio
  const handleDelete = async (portfolioId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/portfolio`, {
        data: { portfolioId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(portfolio.filter((p) => p._id !== portfolioId)); // Remove deleted portfolio
      setSelectedPortfolio(null);
      setError("");
    } catch (error) {
      console.error("Failed to delete portfolio:", error.response?.data?.message || error.message);
      setError("Failed to delete portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a portfolio for editing
// Handle selecting a portfolio for editing
const handleSelectPortfolio = (portfolio) => {
    // If the clicked portfolio is already selected, deselect it
    if (selectedPortfolio?._id === portfolio._id) {
      setSelectedPortfolio(null);
      setFormData({
        name: "",
        category: "Development & IT",
        description: "",
        projectUrl: "",
        budgetPrice: 0,
        images: [],
      });
    } else {
      // Otherwise, select the clicked portfolio
      setSelectedPortfolio(portfolio);
      setFormData({
        name: portfolio.name,
        category: portfolio.category,
        description: portfolio.description,
        projectUrl: portfolio.projectUrl,
        budgetPrice: portfolio.budgetPrice,
        images: portfolio.images,
      });
    }
  };
  

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  // Fetch portfolios on component mount or when userId changes
  useEffect(() => {
    if (userId) {
      fetchPortfolio();
    }
  }, [userId]);

  return (
    <section className="container mx-auto md:mt-5 mt-3 py-3 md:px-5 sm:px-7 px-0 space-y-3">
      <h1 className="text-3xl font-bold text-[#0C4A6E] mb-6">My Portfolio</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading State */}
      {loading && <p className="text-gray-600 mb-4">Loading...</p>}

      {/* Portfolio List */}
      <div className="space-y-4">
  {portfolio.map((project) => (
    <div
      key={project._id}
      className={`grid 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 ${
        selectedPortfolio?._id === project._id ? "border-2 border-[#0C4A6E]" : ""
      }`}
      onClick={() => handleSelectPortfolio(project)}
    >
      {/* Project Image */}
      <div className="relative h-64">
        <Image
          src={project.images[0] ? `http://localhost:4000/${project.images[0]}` : "/images/logo.png"}
          alt={project.name}
          layout="fill"
          objectFit="cover"
          className="md:rounded-l-xl md:rounded-tr-none sm:rounded-t-xl rounded-none"
        />
      </div>

      {/* Project Details */}
      <div className="bg-gradient-to-b from-[#A5F3FC] to-[#7DD3FC] 2xl:col-span-2 col-span-1 md:rounded-r-xl md:rounded-bl-none sm:rounded-b-xl rounded-none xl:px-10 px-5 lg:py-7 py-5">
        <motion.h5
          className="font-semibold lg:text-2xl text-xl text-zinc-700"
          initial={{ y: "100", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {project.category}
        </motion.h5>
        <motion.h3
          className="font-semibold lg:text-5xl text-4xl text-zinc-700 lg:mt-7 mt-5 lg:mb-3 mb-1"
          initial={{ y: "100", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {project.name}
        </motion.h3>
        <motion.p
          className="text-zinc-500 font-semibold"
          initial={{ y: "100", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {project.description}
        </motion.p>

        {/* Buttons for Update and Delete */}
        {selectedPortfolio?._id === project._id && (
          <motion.div
            className="flex space-x-4 mt-4"
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <button
              onClick={handleUpdate}
              className="bg-[#0C4A6E] py-2 px-5 text-white rounded-full hover:bg-[#18465f]"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(project._id)}
              className="bg-red-500 py-2 px-5 text-white rounded-full hover:bg-red-600"
            >
              Delete
            </button>
          </motion.div>
        )}
      </div>
    </div>
  ))}
</div>


      {/* Add/Edit Portfolio Form */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-[#0C4A6E] mb-4">
    {selectedPortfolio ? "Edit Portfolio" : "Add Portfolio"}
  </h2>
  <form onSubmit={selectedPortfolio ? handleUpdate : handleAdd} className="space-y-4">
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      placeholder="Project Name"
      className="w-full p-2 border border-gray-300 rounded-lg"
      required
    />
    <select
      name="category"
      value={formData.category}
      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      className="w-full p-2 border border-gray-300 rounded-lg"
      required
    >
      <option value="Development & IT">Development & IT</option>
      <option value="Design & Creative">Design & Creative</option>
      <option value="Sales & Marketing">Sales & Marketing</option>
      <option value="Writing & Translation">Writing & Translation</option>
      <option value="Admin & Customer Support">Admin & Customer Support</option>
      <option value="Finance & Accounting">Finance & Accounting</option>
      <option value="Engineering & Architecture">Engineering & Architecture</option>
      <option value="Legal">Legal</option>
    </select>
    <textarea
      name="description"
      value={formData.description}
      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      placeholder="Project Description"
      className="w-full p-2 border border-gray-300 rounded-lg"
      required
    />
    <input
      type="url"
      name="projectUrl"
      value={formData.projectUrl}
      onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
      placeholder="Project URL"
      className="w-full p-2 border border-gray-300 rounded-lg"
    />
    <input
      type="number"
      name="budgetPrice"
      value={formData.budgetPrice}
      onChange={(e) => setFormData({ ...formData, budgetPrice: e.target.value })}
      placeholder="Budget Price"
      className="w-full p-2 border border-gray-300 rounded-lg"
      required
    />
    <input
      type="file"
      multiple
      onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
      accept="image/*"
    />
    <button
      type="submit"
      className="w-full py-2 px-4 bg-[#0C4A6E] text-white rounded-lg hover:bg-[#18465f]"
    >
      {selectedPortfolio ? "Update" : "Add"}
    </button>
  </form>
</div>
    </section>
  );
};

export default PortfolioManager;