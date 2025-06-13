
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, User, Tag, MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface SalesMan {
  id: number;
  name: string;
  email?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedTo: SalesMan;
  assignedDate: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low' | null; // Allow null for robustness
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [salesmen, setSalesmen] = useState<SalesMan[]>([]);
  const [taskStatusUpdates, setTaskStatusUpdates] = useState<{ [key: string]: string }>({});
  const [priorityUpdates, setPriorityUpdates] = useState<{ [key: string]: string }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'assignedTo'> & { salesManId: number | '' }>({
    title: '',
    description: '',
    assignedBy: userType === 'admin' ? 'Admin' : '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    comments: [],
    salesManId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const taskResponse = await fetch('http://localhost:8081/api/tasks', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!taskResponse.ok) {
          const errorText = await taskResponse.text();
          throw new Error(`Failed to fetch tasks: ${errorText}`);
        }
        const taskData: Task[] = await taskResponse.json();
        console.log('Fetched tasks:', taskData); // Debug log
        setTasks(taskData);

        // Fetch salesmen
        const salesmanResponse = await fetch('http://localhost:8081/api/salesman/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!salesmanResponse.ok) {
          const errorText = await salesmanResponse.text();
          throw new Error(`Failed to fetch salesmen: ${errorText}`);
        }
        const salesmanData: SalesMan[] = await salesmanResponse.json();
        console.log('Fetched salesmen:', salesmanData); // Debug log
        setSalesmen(salesmanData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Fetch error:', errorMessage); // Debug log
        setError(`Error fetching data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userType !== 'admin') {
      setError('Only admin users can assign tasks');
      return;
    }
    if (!newTask.salesManId) {
      setError('Please select a salesman');
      return;
    }
    try {
      const payload = {
        title: newTask.title,
        description: newTask.description,
        assignedBy: newTask.assignedBy,
        assignedDate: newTask.assignedDate,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        status: newTask.status,
        comments: newTask.comments,
        schoolId: newTask.schoolId,
        schoolName: newTask.schoolName,
      };
      console.log('Adding task payload:', payload); // Debug log
      const response = await fetch(`http://localhost:8081/api/tasks/assign/${newTask.salesManId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign task');
      }
      const savedTask: Task = await response.json();
      console.log('Saved task:', savedTask); // Debug log
      setTasks([...tasks, savedTask]);
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
        salesManId: '',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Add task error:', errorMessage); // Debug log
      setError(`Error assigning task: ${errorMessage}`);
    }
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
                  author: userType === 'admin' ? 'Admin' : 'Sales User',
                  timestamp: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  }),
                },
              ]
            : task.comments;

          return {
            ...task,
            status: (taskStatusUpdates[taskId] as 'completed' | 'in-progress' | 'pending') || task.status,
            priority: (priorityUpdates[taskId] as 'high' | 'medium' | 'low' | null) || task.priority,
            comments: updatedComments,
          };
        }
        return task;
      })
    );

    setTaskStatusUpdates((prev) => {
      const { [taskId]: _, ...rest } = prev;
      return rest;
    });
    setPriorityUpdates((prev) => {
      const { [taskId]: _, ...rest } = prev;
      return rest;
    });
    setNewComments((prev) => {
      const { [taskId]: _, ...rest } = prev;
      return rest;
    });
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
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
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

  const getPriorityClass = (priority: string | null) => {
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
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-sm underline">
            Dismiss
          </button>
        </div>
      )}
      {loading && <div className="text-center py-4">Loading tasks and salesmen...</div>}
      {!loading && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Tasks</h1>
            {userType === 'admin' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salesman</label>
                    <select
                      name="salesManId"
                      value={newTask.salesManId}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    >
                      <option value="">Select Salesman</option>
                      {salesmen.length > 0 ? (
                        salesmen.map((salesman) => (
                          <option key={salesman.id} value={salesman.id}>
                            {salesman.name || 'Unknown Salesman'}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No salesmen available
                        </option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTasks.length === 0 && !loading && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks found.</p>
                </div>
              )}
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task.id, task.schoolId)}
                  className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{task.title || 'Untitled Task'}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(task.status)}`}>
                          {task.status === 'in-progress'
                            ? 'In Progress'
                            : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(task.priority)}`}>
                          {task.priority
                            ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + ' Priority'
                            : 'No Priority'}
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
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      )}
                      {userType === 'admin' && (
                        <select
                          value={priorityUpdates[task.id] || task.priority || 'medium'}
                          onChange={(e) => handleTaskStatusChange(task.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{task.description || 'No description provided'}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Assigned by:</span>
                      <span>{task.assignedBy || 'Unknown'}</span>
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

                  {(userType === 'sales' || userType === 'admin') && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
                      {task.comments?.length > 0 ? (
                        <ul className="space-y-2 mb-3">
                          {task.comments.map((comment) => (
                            <li key={comment.id} className="p-2 bg-gray-100 rounded-md">
                              <div className="flex items-start space-x-2">
                                <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">{comment.author || 'Unknown'}</span> •{' '}
                                    {comment.timestamp || 'No timestamp'}
                                  </p>
                                  <p className="text-sm">{comment.text || 'No comment text'}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 mb-3">No comments yet.</p>
                      )}
                      {userType === 'sales' && (
                        <>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                          <textarea
                            value={newComments[task.id] || ''}
                            onChange={(e) => handleNewCommentChange(task.id, e)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Add a new comment here"
                            rows={2}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </>
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Update Task
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tasks;