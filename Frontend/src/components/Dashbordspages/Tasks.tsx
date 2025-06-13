import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, User, Tag, Plus } from 'lucide-react';

interface SalesMan {
  id: number;
  name: string;
  email?: string;
  password?: string;
  status?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low' | 'High' | 'Medium' | 'Low' | null;
  assignedTo: SalesMan;
}

interface TasksProps {
  userType: 'admin' | 'sales' | 'student' | 'school';
}

const Tasks: React.FC<TasksProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [salesmen, setSalesmen] = useState<SalesMan[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'assignedTo'> & { salesManId: number | '' }>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
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
        console.log('Fetched tasks:', taskData);
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
        console.log('Fetched salesmen:', salesmanData);
        setSalesmen(salesmanData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Fetch error:', errorMessage);
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
      console.log('Saved task:', savedTask);
      setTasks([...tasks, savedTask]);
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
    return new Date(dateString).toLocaleDateString();
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
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {new Date(task.dueDate) < new Date() && (
                  <span className="text-red-500 text-xs">(Overdue)</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tasks found.</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;