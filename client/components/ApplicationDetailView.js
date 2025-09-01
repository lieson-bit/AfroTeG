import { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicationDetailView = ({ application, onBack, jobId, userId, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [freelancer, setFreelancer] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMessages(true);
        const token = localStorage.getItem('token');
        
        // Fetch freelancer details
        const freelancerRes = await axios.get(
          `http://localhost:4000/api/profile/${application.freelancer}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFreelancer(freelancerRes.data);

        // Fetch messages
        const messagesRes = await axios.get(
          `http://localhost:4000/api/jobs/${jobId}/applications/${application._id}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages(messagesRes.data.messages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    if (jobId && application?._id) {
      fetchData();
    }
  }, [jobId, application]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setIsSending(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4000/api/jobs/${jobId}/applications/${application._id}/respond`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newMsg = {
        ...response.data,
        sender: { _id: userId },
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      onMessageSent();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to applications
        </button>
      </div>

      {/* Main content area - Made wider */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Freelancer info panel (left) - Made wider */}
        <div className="lg:w-5/5 bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
              {freelancer?.firstName?.charAt(0) || 'F'}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {freelancer?.firstName || 'Freelancer'} {freelancer?.lastName || ''}
              </h2>
              <p className="text-gray-500">{freelancer?.country || 'Location not specified'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Proposal</h3>
              <p className="text-gray-700">{application.proposal}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Bid Amount</p>
                <p className="font-medium">${application.bidAmount}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${
                  application.status === 'Pending' ? 'text-yellow-600' :
                  application.status === 'Accepted' ? 'text-green-600' :
                  'text-gray-600'
                }`}>
                  {application.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation panel (right) - Made wider */}
        <div className="lg:w-5/5 bg-white rounded-lg shadow flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Conversation</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation</p>
              </div>
            ) : (
              messages.map((message) => {
                const isClient = message.sender._id === userId || message.sender === userId;
                return (
                  <div 
                    key={message._id} 
                    className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      isClient 
                        ? 'bg-blue-100 rounded-tr-none' 
                        : 'bg-gray-100 rounded-tl-none'
                    }`}>
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium">
                          {isClient ? 'You' : `${freelancer?.firstName || 'Freelancer'}`}
                        </span>
                      </div>
                      <p className="text-gray-800">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp || message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message input - Made wider */}
          <div className="p-4 border-t">
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailView;