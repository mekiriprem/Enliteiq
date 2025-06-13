import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, User, Tag, Plus, MessageCircle, Send } from 'lucide-react';

interface SalesManDto {
  id: number;
  name: string;
  email?: string;
  status?: string;
}

interface TaskDto {
  id: number;
  title: string;
  description: string;
  dueDate: string; // formatted as "dd-MM-yyyy"
  priority: 'high' | 'medium' | 'low' | 'High' | 'Medium' | 'Low' | null;
  remarks?: string;
  assignedTo: SalesManDto;
}

interface SalesMan {
  id: number;
  name: string;
  email?: string;
  password?: string;
  status?: string;
}

interface TasksProps {
  userType: 'admin' | 'sales' | 'student' | 'school';
}

const Tasks: React.FC<TasksProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [salesmen, setSalesmen] = useState<SalesMan[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Omit<TaskDto, 'id' | 'assignedTo'> & { salesManId: number | '' }>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    salesManId: '',
  });
  const [newRemarks, setNewRemarks] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
    // Get current user info from storage (you may need to adjust this based on your auth system)
  const getCurrentUserId = () => {
    // Try multiple possible storage keys
    const possibleKeys = [
      'userData', 'salesmanData', 'user', 'authUser', 'currentUser',
      'salesmanToken', 'userInfo', 'loggedInUser'
    ];
    
    for (const key of possibleKeys) {
      // Check localStorage first
      let userData = localStorage.getItem(key);
      if (!userData) {
        // Check sessionStorage if not found in localStorage
        userData = sessionStorage.getItem(key);
      }
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log(`Found user data in ${key}:`, user); // Debug log
          // Try different possible ID field names
          const userId = user.id || user.salesmanId || user.userId || user.salesManId;
          if (userId) {
            console.log(`Found user ID: ${userId}`); // Debug log
            return userId;
          }        } catch (e) {
          console.log(`Error parsing ${key}:`, e);
          // If it's not JSON, maybe it's just the ID
          if (!isNaN(Number(userData))) {
            console.log(`Found numeric ID in ${key}: ${userData}`);
            return parseInt(userData);
          }
        }
      }
    }
    
    console.log('No user ID found in any storage key'); // Debug log
    return null;
  };

  const getCurrentUserName = () => {
    // Try multiple possible storage keys
    const possibleKeys = [
      'userData', 'salesmanData', 'user', 'authUser', 'currentUser',
      'salesmanToken', 'userInfo', 'loggedInUser'
    ];
    
    for (const key of possibleKeys) {
      // Check localStorage first
      let userData = localStorage.getItem(key);
      if (!userData) {
        // Check sessionStorage if not found in localStorage
        userData = sessionStorage.getItem(key);
      }
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const userName = user.name || user.username || user.salesmanName || user.fullName;
          if (userName) {
            return userName;
          }        } catch (e) {
          // If it's not JSON, maybe it's just the name
          if (typeof userData === 'string' && userData.length > 0 && isNaN(Number(userData))) {
            return userData;
          }
        }
      }
    }
    
    return 'Unknown';
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Debug: Log all storage contents
        console.log('=== DEBUGGING STORAGE ===');
        console.log('localStorage contents:');
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            console.log(`${key}:`, localStorage.getItem(key));
          }
        }
        console.log('sessionStorage contents:');
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            console.log(`${key}:`, sessionStorage.getItem(key));
          }
        }
        console.log('========================');

        // Fetch tasks based on user type
        let taskResponse;
        if (userType === 'admin') {
          // Admin sees all tasks
          taskResponse = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/tasks', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
        } else if (userType === 'sales') {
          // Salesman sees only their tasks
          const salesmanId = getCurrentUserId();
          console.log('Found salesmanId:', salesmanId); // Debug log
          if (!salesmanId) {
            throw new Error('Salesman ID not found. Please login again.');
          }
          taskResponse = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/tasks/bysalesman/${salesmanId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          // Other user types don't have access to tasks
          setTasks([]);
          setLoading(false);
          return;
        }

        if (!taskResponse.ok) {
          const errorText = await taskResponse.text();
          throw new Error(`Failed to fetch tasks: ${errorText}`);
        }
        
        const taskData: TaskDto[] = await taskResponse.json();
        console.log('Fetched tasks:', taskData);
        setTasks(taskData);

        // Only fetch salesmen for admin users (for the add task form)
        if (userType === 'admin') {
          const salesmanResponse = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/salesman/all', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!salesmanResponse.ok) {
            const errorText = await salesmanResponse.text();
            throw new Error(`Failed to fetch salesmen: ${errorText}`);
          }
          const salesmanData: SalesMan[] = await salesmanResponse.json();
          console.log('Fetched salesmen:', salesmanData);
          setSalesmen(salesmanData);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Fetch error:', errorMessage);
        setError(`Error fetching data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userType !== 'admin') {
      setError('Only admin users can add tasks');
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
        dueDate: newTask.dueDate,
        priority: newTask.priority,
      };
      console.log('Adding task payload:', payload);
      const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/tasks/assign/${newTask.salesManId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign task');
      }
      const savedTask: TaskDto = await response.json();
      console.log('Saved task:', savedTask);
      
      // Refresh tasks list
      if (userType === 'admin') {
        const taskResponse = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/tasks');
        if (taskResponse.ok) {
          const taskData: TaskDto[] = await taskResponse.json();
          setTasks(taskData);
        }
      }
      
      setShowAddForm(false);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        salesManId: '',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Add task error:', errorMessage);
      setError(`Error assigning task: ${errorMessage}`);
    }
  };

  const handleRemarkChange = (taskId: number, remark: string) => {
    setNewRemarks(prev => ({ ...prev, [taskId]: remark }));
  };

  const handleAddRemark = async (taskId: number) => {
    const remark = newRemarks[taskId];
    if (!remark || !remark.trim()) {
      setError('Please enter a remark');
      return;
    }

    try {
      const payload = {
        role: userType === 'admin' ? 'admin' : 'salesman',
        name: getCurrentUserName(),
        remark: remark.trim(),
      };

      const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/tasks/${taskId}/remark`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add remark: ${errorText}`);
      }

      // Refresh tasks to show updated remark
      if (userType === 'admin') {
        const taskResponse = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/tasks');
        if (taskResponse.ok) {
          const taskData: TaskDto[] = await taskResponse.json();
          setTasks(taskData);
        }
      } else if (userType === 'sales') {
        const salesmanId = getCurrentUserId();
        if (salesmanId) {
          const taskResponse = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/tasks/bysalesman/${salesmanId}`);
          if (taskResponse.ok) {
            const taskData: TaskDto[] = await taskResponse.json();
            setTasks(taskData);
          }
        }
      }

      // Clear the remark input
      setNewRemarks(prev => ({ ...prev, [taskId]: '' }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Add remark error:', errorMessage);
      setError(`Error adding remark: ${errorMessage}`);
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  const formatDate = (dateString: string) => {
    // Backend returns date in "dd-MM-yyyy" format
    if (dateString.includes('-') && dateString.split('-').length === 3) {
      const [day, month, year] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    // Fallback for other date formats
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dateString: string) => {
    // Convert "dd-MM-yyyy" to Date object for comparison
    if (dateString.includes('-') && dateString.split('-').length === 3) {
      const [day, month, year] = dateString.split('-');
      const dueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return dueDate < new Date();
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-sm underline">Dismiss</button>
        </div>
      )}      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {userType === 'admin' ? 'Task Management' : 'My Tasks'}
          </h1>
          {userType === 'sales' && (
            <p className="text-gray-600 mt-1">Tasks assigned to you</p>
          )}
        </div>
        {userType === 'admin' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Task
          </button>
        )}
      </div>

      {showAddForm && userType === 'admin' && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Salesman</label>
                <select
                  name="salesManId"
                  value={newTask.salesManId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="">Select Salesman</option>
                  {salesmen.map((salesman) => (
                    <option key={salesman.id} value={salesman.id}>
                      {salesman.name}
                    </option>
                  ))}
                </select>
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <small className="text-gray-500">Backend expects YYYY-MM-DD format</small>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={newTask.priority || 'Medium'}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
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
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority || 'Medium'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{task.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Assigned to: {task.assignedTo?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Due: {formatDate(task.dueDate)}</span>
                {isOverdue(task.dueDate) && (
                  <span className="text-red-500 text-xs">(Overdue)</span>
                )}
              </div>
            </div>

            {/* Last Remark Section */}
            {task.remarks && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2 mb-1">
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Last Remark:</span>
                </div>
                <p className="text-sm text-gray-600">{task.remarks}</p>
              </div>
            )}

            {/* Add Remark Section */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Add Remark:</span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newRemarks[task.id] || ''}
                  onChange={(e) => handleRemarkChange(task.id, e.target.value)}
                  placeholder="Enter your remark..."
                  className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddRemark(task.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleAddRemark(task.id)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  title="Add Remark"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>      {tasks.length === 0 && !loading && (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {userType === 'admin' ? 'No tasks found.' : 'No tasks assigned to you.'}
          </p>
        </div>
      )}

      {userType !== 'admin' && userType !== 'sales' && (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">You don't have access to view tasks.</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;