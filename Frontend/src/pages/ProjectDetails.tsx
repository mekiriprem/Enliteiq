import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  BarChart2, 
  FileText
} from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

// Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  completion: number;
  teamSize: number;
  teamLead: string;
  documents: Document[];
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  size: string;
}

// Sample project data
const projectsData: Project[] = [
  {
    id: '1',
    title: 'Physics Olympiad 2023',
    description: 'National-level competition for high school students focusing on advanced physics concepts and problem-solving.',
    startDate: '2023-06-15',
    endDate: '2023-12-10',
    status: 'completed',
    completion: 100,
    teamSize: 8,
    teamLead: 'Dr. Arun Sharma',
    documents: [
      {
        id: 'd1',
        name: 'Competition Guidelines.pdf',
        type: 'PDF',
        uploadedDate: '2023-05-20',
        size: '2.4 MB'
      },
      {
        id: 'd2',
        name: 'Results Summary.xlsx',
        type: 'Excel',
        uploadedDate: '2023-12-15',
        size: '1.8 MB'
      }
    ],
    tasks: [
      {
        id: 't1',
        title: 'Prepare question papers',
        assignedTo: 'Dr. Meera Patel',
        dueDate: '2023-07-30',
        status: 'completed'
      },
      {
        id: 't2',
        title: 'Organize venue logistics',
        assignedTo: 'Rakesh Kumar',
        dueDate: '2023-09-15',
        status: 'completed'
      }
    ]
  },
  {
    id: '2',
    title: 'Mathematics Challenge 2024',
    description: 'Annual mathematics competition for middle and high school students with regional and national rounds.',
    startDate: '2024-02-10',
    endDate: '2024-08-30',
    status: 'in-progress',
    completion: 65,
    teamSize: 12,
    teamLead: 'Prof. Sanjay Gupta',
    documents: [
      {
        id: 'd3',
        name: 'Registration Form.docx',
        type: 'Word',
        uploadedDate: '2024-01-05',
        size: '520 KB'
      },
      {
        id: 'd4',
        name: 'Budget Estimate.pdf',
        type: 'PDF',
        uploadedDate: '2024-01-12',
        size: '1.2 MB'
      }
    ],
    tasks: [
      {
        id: 't3',
        title: 'Finalize regional centers',
        assignedTo: 'Anita Singh',
        dueDate: '2024-03-01',
        status: 'completed'
      },
      {
        id: 't4',
        title: 'Coordinate with school partners',
        assignedTo: 'Vivek Joshi',
        dueDate: '2024-04-15',
        status: 'in-progress'
      }
    ]
  },
  {
    id: '3',
    title: 'Science Talent Search 2024',
    description: 'Multi-disciplinary science research competition for identifying and nurturing future scientists.',
    startDate: '2024-03-01',
    endDate: '2024-11-15',
    status: 'in-progress',
    completion: 40,
    teamSize: 10,
    teamLead: 'Dr. Priya Narayanan',
    documents: [
      {
        id: 'd5',
        name: 'Project Guidelines.pdf',
        type: 'PDF',
        uploadedDate: '2024-02-10',
        size: '3.1 MB'
      },
      {
        id: 'd6',
        name: 'Judging Criteria.docx',
        type: 'Word',
        uploadedDate: '2024-02-15',
        size: '845 KB'
      }
    ],
    tasks: [
      {
        id: 't5',
        title: 'Recruit expert judges',
        assignedTo: 'Deepak Mehta',
        dueDate: '2024-04-30',
        status: 'in-progress'
      },
      {
        id: 't6',
        title: 'Prepare promotional materials',
        assignedTo: 'Kavita Reddy',
        dueDate: '2024-03-15',
        status: 'completed'
      }
    ]
  }
];

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'documents'>('overview');

  // Find the project by ID
  const project = projectsData.find((p) => p.id === projectId);

  if (!project) {
    return (
      <DashboardLayout
        userType="admin"
        title="Project Not Found"
        userName="Rahul Gupta"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Project Not Found</h1>
          <p className="text-gray-600">The project with ID {projectId} could not be found.</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Format date from YYYY-MM-DD to Month DD, YYYY
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-purple-100 text-purple-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render the document icon based on type
  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'excel':
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'word':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout
      userType="admin"
      title={`Project Details - ${project.title}`}
      userName="Rahul Gupta"
    >
      <div className="p-4 md:p-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* Project header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
                <div className="flex items-center mt-1">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                  </span>
                  <span className="text-sm text-gray-500 ml-3">{project.completion}% Complete</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                Edit Project
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Download Report
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${project.completion}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 text-right mb-4">{project.completion}% completed</p>

          {/* Project info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-600">Timeline</h3>
              </div>
              <p className="text-sm text-gray-800">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-600">Team</h3>
              </div>
              <p className="text-sm text-gray-800">
                {project.teamSize} members • Lead: {project.teamLead}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-600">Tasks</h3>
              </div>
              <p className="text-sm text-gray-800">
                {project.tasks.filter(t => t.status === 'completed').length} of {project.tasks.length} completed
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-600">Documents</h3>
              </div>
              <p className="text-sm text-gray-800">
                {project.documents.length} files uploaded
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`inline-block p-4 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`inline-block p-4 text-sm font-medium ${
                  activeTab === 'tasks'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tasks
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('documents')}
                className={`inline-block p-4 text-sm font-medium ${
                  activeTab === 'documents'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Documents
              </button>
            </li>
          </ul>
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Project Description</h2>
              <p className="text-gray-700 mb-6">{project.description}</p>
              
              <h2 className="text-lg font-semibold mb-4">Key Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Start Date</h3>
                    <p className="text-gray-900">{formatDate(project.startDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">End Date</h3>
                    <p className="text-gray-900">{formatDate(project.endDate)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Team Lead</h3>
                  <p className="text-gray-900">{project.teamLead}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Team Size</h3>
                  <p className="text-gray-900">{project.teamSize} members</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                  Add Task
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project.tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{task.assignedTo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(task.dueDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile version of tasks table */}
              <div className="block md:hidden mt-4 space-y-4">
                {project.tasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Assigned to:</p>
                        <p>{task.assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Due date:</p>
                        <p>{formatDate(task.dueDate)}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Documents</h2>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                  Upload Document
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getDocumentIcon(doc.type)}
                            <div className="ml-3 text-sm font-medium text-gray-900">{doc.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{doc.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(doc.uploadedDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{doc.size}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors mr-3">
                            Download
                          </button>
                          <button className="text-red-600 hover:text-red-800 transition-colors">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile version of documents table */}
              <div className="block md:hidden mt-4 space-y-4">
                {project.documents.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      {getDocumentIcon(doc.type)}
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">{doc.name}</h3>
                        <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Uploaded on {formatDate(doc.uploadedDate)}</p>
                    <div className="flex space-x-3">
                      <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-blue-600">
                        Download
                      </button>
                      <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
