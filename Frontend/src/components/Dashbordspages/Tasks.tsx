import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, User, Tag, MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string; // Format: "YYYY-MM-DD HH:MM AM/PM"
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

interface TasksProps {
  userType: 'admin' | 'sales' | 'student' | 'school';
}

const Tasks: React.FC<TasksProps> = ({ userType }) => {
  const navigate = useNavigate();
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

  const [taskStatusUpdates, setTaskStatusUpdates] = useState<{ [key: string]: string }>({});
  const [priorityUpdates, setPriorityUpdates] = useState<{ [key: string]: string }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    assignedBy: userType === 'admin' ? 'Admin' : '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    comments: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks([...tasks, task]);
    setShowAddForm(false);
    setNewTask({
      title: '',
      description: '',
      assignedBy: userType === 'admin' ? 'Admin' : '',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      comments: [],
    });
  };

  const handleTaskStatusChange = (taskId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskStatusUpdates({ ...taskStatusUpdates, [taskId]: e.target.value });
  };

  const handlePriorityChange = (taskId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityUpdates({ ...priorityUpdates, [taskId]: e.target.value });
  };

  const handleNewCommentChange = (taskId: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComments({ ...newComments, [taskId]: e.target.value });
  };

  const updateTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedComments = newComments[taskId]?.trim()
            ? [
                ...task.comments,
                {
                  id: `c${task.comments.length + 1}`,
                  text: newComments[taskId],
                  author: 'Sales User', // Replace with actual user name from auth context if available
                  timestamp: '2025-05-16 11:46 AM', // Current date and time: May 16, 2025, 11:46 AM IST
                },
              ]
            : task.comments;

          return {
            ...task,
            status: (taskStatusUpdates[taskId] as 'completed' | 'in-progress' | 'pending') || task.status,
            priority: (priorityUpdates[taskId] as 'high' | 'medium' | 'low') || task.priority,
            comments: updatedComments,
          };
        }
        return task;
      })
    );

    const { [taskId]: removedStatus, ...remainingStatusUpdates } = taskStatusUpdates;
    setTaskStatusUpdates(remainingStatusUpdates);

    const { [taskId]: removedPriority, ...remainingPriorityUpdates } = priorityUpdates;
    setPriorityUpdates(remainingPriorityUpdates);

    const { [taskId]: removedComment, ...remainingNewComments } = newComments;
    setNewComments(remainingNewComments);
  };

  const handleTaskClick = (taskId: string, schoolId?: string) => {
    if (schoolId) {
      navigate(`/admin/school/${schoolId}`);
    } else {
      navigate(`/admin/task/${taskId}`);
    }
  };

  const filteredTasks = tasks.filter((task) => filter === 'all' || task.status === filter);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {userType === 'admin' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-education-blue text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Assign New Task
          </button>
        )}
      </div>

      {showAddForm && userType === 'admin' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Assign New Task</h2>
          <form onSubmit={handleAddTask}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-education-blue text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Assign Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold">Task List</h2>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'in-progress' | 'completed')}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task.id, task.schoolId)}
              className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div>
                  <h3 className="font-medium text-lg">{task.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(task.status)}`}>
                      {task.status === 'in-progress'
                        ? 'In Progress'
                        : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    {task.schoolName ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {task.schoolName}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        No School Assigned
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {userType === 'sales' && (
                    <select
                      value={taskStatusUpdates[task.id] || task.status}
                      onChange={(e) => handleTaskStatusChange(task.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}
                  {userType === 'admin' && (
                    <select
                      value={priorityUpdates[task.id] || task.priority}
                      onChange={(e) => handlePriorityChange(task.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{task.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Assigned by:</span>
                  <span>{task.assignedBy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Assigned:</span>
                  <span>{formatDate(task.assignedDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Due:</span>
                  <span
                    className={
                      new Date(task.dueDate) < new Date() && task.status !== 'completed'
                        ? 'text-red-500 font-medium'
                        : ''
                    }
                  >
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>

              {userType === 'sales' && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
                  {task.comments.length > 0 ? (
                    <ul className="space-y-2 mb-3">
                      {task.comments.map((comment) => (
                        <li key={comment.id} className="p-2 bg-gray-100 rounded-md">
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
                    <p className="text-sm text-gray-500 mb-3">No comments yet.</p>
                  )}
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                  <textarea
                    value={newComments[task.id] || ''}
                    onChange={(e) => handleNewCommentChange(task.id, e)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Add a new comment here"
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                  />
                </div>
              )}

              {userType === 'admin' && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
                  {task.comments.length > 0 ? (
                    <ul className="space-y-2">
                      {task.comments.map((comment) => (
                        <li key={comment.id} className="p-2 bg-gray-100 rounded-md">
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
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  )}
                </div>
              )}

              {(userType === 'sales' && (taskStatusUpdates[task.id] || newComments[task.id]?.trim())) ||
              (userType === 'admin' && priorityUpdates[task.id]) ? (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTask(task.id);
                    }}
                    className="px-4 py-2 bg-education-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Task
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tasks found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;