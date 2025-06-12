import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Calendar, User, Tag, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'pending';
  comments: Comment[];
  schoolId?: string;
  schoolName?: string;
}

const TaskDetail: React.FC<{ userType?: 'admin' | 'sales' | 'student' | 'school' }> = ({ userType = 'admin' }) => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Contact Delhi Public School',
      description: 'Follow up with DPS regarding their interest in the upcoming Science Olympiad',
      assignedBy: 'Amit Kumar',
      assignedDate: '2025-05-10',
      dueDate: '2025-05-25',
      priority: 'high',
      status: 'in-progress',
      comments: [
        {
          id: 'c1',
          text: 'Called once, need to follow up again',
          author: 'Amit Kumar',
          timestamp: '2025-05-10 09:30 AM',
        },
      ],
      schoolId: '1',
      schoolName: 'Delhi Public School',
    },
    {
      id: '2',
      title: 'Prepare School Presentation',
      description: 'Create a presentation showcasing our platform benefits for new schools',
      assignedBy: 'Amit Kumar',
      assignedDate: '2025-05-08',
      dueDate: '2025-05-20',
      priority: 'medium',
      status: 'pending',
      comments: [],
    },
    {
      id: '3',
      title: 'Send Welcome Package to Ryan International',
      description: 'Compile and send welcome materials to newly onboarded Ryan International School',
      assignedBy: 'Priya Singh',
      assignedDate: '2025-05-05',
      dueDate: '2025-05-12',
      priority: 'medium',
      status: 'completed',
      comments: [
        {
          id: 'c1',
          text: 'Package sent via courier, tracking number: 123456789',
          author: 'Priya Singh',
          timestamp: '2025-05-05 02:15 PM',
        },
      ],
      schoolId: '3',
      schoolName: 'Ryan International School',
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const task = tasks.find((t) => t.id === taskId);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [
                ...t.comments,
                {
                  id: `c${t.comments.length + 1}`,
                  text: newComment.trim(),
                  author: 'Sales User', // Replace with actual user name from auth context if available
                  timestamp: '2025-05-16 12:23 PM', // Current date and time: May 16, 2025, 12:23 PM IST
                },
              ],
            }
          : t
      )
    );
    setNewComment('');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!task) {
    return (
      <DashboardLayout
        userType={userType}
        title="Task Not Found"
        userName="Rahul Gupta"
       
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Task Not Found</h1>
          <p className="text-gray-600">The task with ID {taskId} could not be found.</p>
          <button
            onClick={() => navigate('/admin/dashboard', { replace: false })}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
      userType={userType}
      title={`Task Details - ${task.title}`}
      userName="Rahul Gupta"
     
    >
      <div className="p-6">
        <button
          onClick={() => navigate('/admin/dashboard', { replace: false })}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">{task.title}</h1>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Description</p>
                <p className="text-gray-800">{task.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Assigned By</p>
                <p className="text-gray-800">{task.assignedBy}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Assigned Date</p>
                <p className="text-gray-800">{formatDate(task.assignedDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Due Date</p>
                <p className="text-gray-800">{formatDate(task.dueDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(task.status)}`}>
                  {task.status === 'in-progress'
                    ? 'In Progress'
                    : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Priority</p>
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Comments</h2>
            {task.comments.length > 0 ? (
              <ul className="space-y-3 mb-4">
                {task.comments.map((comment) => (
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

            {userType === 'sales' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a new comment here"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`mt-2 px-4 py-2 rounded-md text-white transition-colors ${
                    newComment.trim()
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-300 cursor-not-allowed'
                  }`}
                >
                  Submit Comment
                </button>
              </div>
            )}
            {/* Comments Section */}
            <div className="mt-6">
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
      </div>
    </DashboardLayout>
  );
};

export default TaskDetail;