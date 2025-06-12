import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, CheckCircle2, Search, Plus } from 'lucide-react';

// Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  completion: number;
}

// Props interface
interface ProjectsProps {
  userType: 'student' | 'admin' | 'school' | 'sales';
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
  },
  {
    id: '2',
    title: 'Mathematics Challenge 2024',
    description: 'Annual mathematics competition for middle and high school students with regional and national rounds.',
    startDate: '2024-02-10',
    endDate: '2024-08-30',
    status: 'in-progress',
    completion: 65,
  },
  {
    id: '3',
    title: 'Science Talent Search 2024',
    description: 'Multi-disciplinary science research competition for identifying and nurturing future scientists.',
    startDate: '2024-03-01',
    endDate: '2024-11-15',
    status: 'in-progress',
    completion: 40,
  },
  {
    id: '4',
    title: 'Coding Competition 2024',
    description: 'Programming challenge for students to showcase their coding and problem-solving skills across different languages.',
    startDate: '2024-05-01',
    endDate: '2024-10-30',
    status: 'planning',
    completion: 15,
  },
  {
    id: '5',
    title: 'English Literature Olympiad',
    description: 'Competition focusing on literary analysis, critical thinking, and creative writing for high school students.',
    startDate: '2024-07-15',
    endDate: '2024-12-20',
    status: 'planning',
    completion: 5,
  },
  {
    id: '6',
    title: 'Robotics Challenge 2023',
    description: 'Team-based competition for designing and programming robots to complete specific tasks and challenges.',
    startDate: '2023-09-01',
    endDate: '2023-11-30',
    status: 'completed',
    completion: 100,
  }
];

const Projects: React.FC<ProjectsProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Format date from YYYY-MM-DD to Month DD, YYYY
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
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

  // Handle click on project card
  const handleProjectClick = (projectId: string) => {
    navigate(`/admin/project/${projectId}`);
  };

  // Filter projects based on search term and status filter
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-md px-4 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No projects found</h2>
          <p className="text-gray-500 mb-4">We couldn't find any projects matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg line-clamp-1" title={project.title}>{project.title}</h3>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm h-10" title={project.description}>
                {project.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.completion}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Progress</span>
                <span>{project.completion}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
