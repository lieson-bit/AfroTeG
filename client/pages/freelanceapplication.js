import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FreelancerApplicationPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [profilePics, setProfilePics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: '',
    file: null
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  // Fetch freelancers from database
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/profile/freelancers/all`);
        const freelancersWithRating = response.data.map(freelancer => ({
          ...freelancer,
          rating: freelancer.rating || 0,
          ratingCount: freelancer.ratingCount || 0
        }));
        setFreelancers(freelancersWithRating);
        
        // Fetch profile pictures for each freelancer
        const pics = {};
        for (const freelancer of response.data) {
          if (freelancer.profilePic) {
            try {
              const picResponse = await axios.get(`${API_BASE_URL}/${freelancer.profilePic}`, {
                headers: { 
                  Authorization: `Bearer ${token}`,
                },
                responseType: 'blob'
              });
              pics[freelancer._id] = URL.createObjectURL(picResponse.data);
            } catch (error) {
              console.error("Error fetching profile picture:", error);
              pics[freelancer._id] = '/default-avatar.png';
            }
          } else {
            pics[freelancer._id] = '/default-avatar.png';
          }
        }
        setProfilePics(pics);
        
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch freelancers');
        setLoading(false);
      }
    };

    fetchFreelancers();

    // Cleanup function to revoke object URLs
    return () => {
      if (profilePics) {
        Object.values(profilePics).forEach(url => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('receiverId', selectedFreelancer._id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('message', formData.message);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }
  
      await axios.post(`${API_BASE_URL}/api/messages`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setFormData({
        name: '',
        email: '',
        title: '',
        message: '',
        file: null
      });
      setShowMessageForm(false);
      toast.success('Your message has been sent successfully!');
    } catch (error) {
      console.error("Message sending error:", error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (!ratingValue) {
      toast.error('Please select a rating');
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/ratings`,
        {
          freelancerId: selectedFreelancer._id,
          rating: ratingValue
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.data.success) {
        // Update the specific freelancer's rating in the UI
        setFreelancers(prevFreelancers => 
          prevFreelancers.map(freelancer => 
            freelancer._id === selectedFreelancer._id 
              ? { 
                  ...freelancer, 
                  rating: response.data.averageRating,
                  ratingCount: response.data.totalRatings
                } 
              : freelancer
          )
        );
        
        toast.success('Rating submitted successfully!');
        setRatingValue(0);
        setShowRatingForm(false);
      } else {
        toast.error(response.data.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Rating submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handleRateClick = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setRatingValue(0); // Reset rating value when opening the modal
    setShowRatingForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <p>Loading freelancers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Freelancers</h1>
        
        {/* Freelancers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <div key={freelancer._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    className="h-16 w-16 rounded-full object-cover mr-4" 
                    src={profilePics[freelancer._id] || '/default-avatar.png'}
                    alt={`${freelancer.firstName} ${freelancer.lastName}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {freelancer.firstName} {freelancer.lastName}
                    </h2>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-gray-600">
                        {freelancer.rating ? `${freelancer.rating.toFixed(1)} (${freelancer.ratingCount} ratings)` : 'No ratings yet'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{freelancer.biography || 'No biography available'}</p>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Skills:</h3>
                  <div className="flex flex-wrap mt-2">
                    {freelancer.skills?.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mr-2 mb-2">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedFreelancer(freelancer);
                      setShowMessageForm(true);
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => handleRateClick(freelancer)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Rate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Form Modal */}
        {showMessageForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Message {selectedFreelancer.firstName} {selectedFreelancer.lastName}
                  </h2>
                  <button 
                    onClick={() => setShowMessageForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-blue-800">
                    Please describe your request in more detail and tell us what happened.
                    Let's connect and help you with the solution.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                        Attach File (Optional)
                      </label>
                      <div className="mt-1 flex items-center">
                        <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Choose File
                          <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <span className="ml-2 text-sm text-gray-500">
                          {formData.file ? formData.file.name : 'No file chosen'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowMessageForm(false)}
                      className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Rating Form Modal */}
        {showRatingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Rate {selectedFreelancer.firstName} {selectedFreelancer.lastName}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowRatingForm(false);
                      setRatingValue(0);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleRatingSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating (1-5)
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingValue(star)}
                          className={`text-3xl focus:outline-none ${
                            star <= ratingValue ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRatingForm(false);
                        setRatingValue(0);
                      }}
                      className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        ratingValue ? 'bg-green-600 hover:bg-green-700' : 'bg-green-300 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                      disabled={!ratingValue}
                    >
                      Submit Rating
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerApplicationPage;