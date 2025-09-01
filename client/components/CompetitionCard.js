import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const CompetitionCard = ({ competition }) => {
  const [profilePic, setProfilePic] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (competition.client?.profilePic) {
      const fetchProfilePic = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/${competition.client.profilePic}`, {
            headers: { 
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob'
          });
          const imageUrl = URL.createObjectURL(response.data);
          setProfilePic(imageUrl);
        } catch (error) {
          console.error("Error fetching profile picture:", error);
          setProfilePic('/default-avatar.png');
        }
      };
      fetchProfilePic();
    }

    return () => {
      if (profilePic && profilePic.startsWith('blob:')) {
        URL.revokeObjectURL(profilePic);
      }
    };
  }, [competition.client?.profilePic]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <Link href={`/competitions/${competition._id}`}>
            <a className="text-2xl font-bold text-blue-800 hover:underline">
              {competition.title}
            </a>
          </Link>
          <div className="flex items-center mt-2 space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Prize: ${competition.prizeAmount}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              competition.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
              competition.status === 'Judging' ? 'bg-yellow-100 text-yellow-800' :
              competition.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {competition.status}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {competition.client && (
          <div className="flex items-center">
            {profilePic ? (
              <img 
                src={profilePic} 
                alt={`${competition.client.firstName}'s profile`}
                className="w-10 h-10 rounded-full mr-3 object-cover"
                onError={() => setProfilePic('/default-avatar.png')}
              />
            ) : (
              <img 
                src="/default-avatar.png" 
                alt="Default avatar"
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
            )}
            <div>
              <p className="font-medium text-gray-800">
                {competition.client.firstName} {competition.client.lastName}
              </p>
              <p className="text-gray-500 text-sm">Client</p>
            </div>
          </div>
        )}
      </div>
    
      <p className="mt-4 text-gray-700">{competition.description}</p>
    
      <div className="mt-5">
        <div className="mb-3">
          <h4 className="font-semibold text-gray-800 mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {competition.skillsRequired?.map((skill, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Judging Criteria:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {competition.judgingCriteria?.map((criterion, index) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            Submissions: {competition.submissions?.length || 0}
          </span>
        
          {competition.winner && (
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Winner:</span>
              <div className="flex items-center">
                <img 
                  src={competition.winner.profilePic || '/default-avatar.png'} 
                  alt={competition.winner.firstName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="font-medium">
                  {competition.winner.firstName} {competition.winner.lastName}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Link href={`/competitions/${competition._id}`}>
          <a className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            View Details
          </a>
        </Link>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
          Submit Entry
        </button>
      </div>
    </div>
  );
};

export default CompetitionCard;