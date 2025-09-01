import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PortfolioManager from "../../components/PortfolioManager";
import LoginSignupHeader from "../../components/LoginSignupHeader";
import LoginSignupFooter from "../../components/LoginSignupFooter";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MessageDisplay = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/messages`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            receiverId: userId // Add this parameter to filter by receiverId
          }
        });
        
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  const handleDownload = (attachmentUrl) => {
    if (!attachmentUrl) return;
    
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}/${attachmentUrl.replace(/\\/g, '/')}`; // Fix path separator
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="text-center py-4">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="text-center py-4">No messages yet</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Messages Received</h2>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message._id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{message.title}</h3>
                <p className="text-gray-600">From: {message.senderEmail}</p>
                <p className="text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
              {message.read ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Read
                </span>
              ) : (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  New
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="whitespace-pre-line">{message.message}</p>
            </div>
            {message.attachment && (
              <div className="mt-4">
                <button
                  onClick={() => handleDownload(message.attachment)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Attachment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <LoginSignupHeader />
      <PortfolioManager userId={id} />
      <MessageDisplay userId={id} />
      <LoginSignupFooter />
    </div>
  );
};

export default PortfolioPage;