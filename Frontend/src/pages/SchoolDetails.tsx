import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, School, MapPin, User, Mail, Phone, MessageSquare } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string; // Format: "YYYY-MM-DD HH:MM AM/PM"
}

interface School {
  id: string;
  name: string;
  address: string;
  relevantAuthority: string;
  email: string;
  contactNumber: string;
  comments: Comment[];
}

const SchoolDetail: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newComment, setNewComment] = useState<string>('');

  const [schools, setSchools] = useState<School[]>([
    {
      id: '1',
      name: 'Delhi Public School',
      address: '123 Education Lane, New Delhi, India',
      relevantAuthority: 'Principal Sharma',
      email: 'dps.delhi@example.com',
      contactNumber: '+91 98765 43210',
      comments: [
        {
          id: 'c1',
          text: 'Need to schedule a meeting with the principal.',
          author: 'Rahul Gupta',
          timestamp: '2025-05-10 09:30 AM',
        },
      ],
    },
    {
      id: '2',
      name: 'St. Xavier’s School',
      address: '456 Knowledge Avenue, Mumbai, India',
      relevantAuthority: 'Principal D’Souza',
      email: 'st.xaviers.mumbai@example.com',
      contactNumber: '+91 91234 56789',
      comments: [
        {
          id: 'c1',
          text: 'Science fair preparations are on track.',
          author: 'Rahul Gupta',
          timestamp: '2025-05-12 02:15 PM',
        },
      ],
    },
    {
      id: '3',
      name: 'Ryan International School',
      address: '789 Learning Road, Bangalore, India',
      relevantAuthority: 'Principal Reddy',
      email: 'ryan.bangalore@example.com',
      contactNumber: '+91 99876 54321',
      comments: [],
    },
  ]);

  const school = schools.find((s) => s.id === schoolId);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setSchools((prevSchools) =>
      prevSchools.map((s) =>
        s.id === schoolId
          ? {
              ...s,
              comments: [
                ...s.comments,
                {
                  id: `c${s.comments.length + 1}`,
                  text: newComment,
                  author: 'Rahul Gupta', // Assuming current user
                  timestamp: '2025-05-16 11:07 AM', // Current date and time: May 16, 2025, 11:07 AM IST
                },
              ],
            }
          : s
      )
    );
    setNewComment('');
  };

  if (!school) {
    return (
      <DashboardLayout
        userType="admin"
        title="School Not Found"
        userName="Rahul Gupta"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">School Not Found</h1>
          <p className="text-gray-600">The school with ID {schoolId} could not be found.</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="admin"
      title={`School Details - ${school.name}`}
      userName="Rahul Gupta"
    >
      <div className="p-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <School className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">{school.name}</h1>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Address</p>
                <p className="text-gray-800">{school.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Relevant Authority</p>
                <p className="text-gray-800">{school.relevantAuthority}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-gray-800">{school.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Contact Number</p>
                <p className="text-gray-800">{school.contactNumber}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Comments</h2>
            {school.comments.length > 0 ? (
              <ul className="space-y-3 mb-6">
                {school.comments.map((comment) => (
                  <li key={comment.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{comment.author}</span> • {comment.timestamp}
                        </p>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No comments yet.</p>
            )}

            {/* Add Comment Form */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                disabled={!newComment.trim()}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SchoolDetail;