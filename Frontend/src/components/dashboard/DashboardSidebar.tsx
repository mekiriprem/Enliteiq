import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  BarChart,
  Settings,
  LogOut,
  Users,
  Menu,
  Check,
  X,
  Edit
} from 'lucide-react';

interface SidebarProps {
  userType: 'student' | 'admin' | 'school' | 'sales';
  isSidebarOpen: boolean;
  onClose: () => void;
  onNavigation?: (section: string) => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ userType, isSidebarOpen, onClose, onNavigation }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
    const getNavItems = () => {
    switch (userType) {
      case 'student':
        return [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/student-dashboard' },
          { icon: <BookOpen size={20} />, label: 'Exam Results', path: '/student-exam-results' },
          { icon: <FileText size={20} />, label: 'Tests', path: '/student-upcoming-exams' },
        ];
      case 'sales':
        return [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/sales-dashboard' },
          { icon: <Users size={20} />, label: 'Schools', path: '/sales-schools' },
          { icon: <Check size={20} />, label: 'Tasks', path: '/sales-tasks' },
        ];      case 'admin':
        return [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin-dashboard' },
          { icon: <Users size={20} />, label: 'Schools', path: '/admin-schools' },
          { icon: <Users size={20} />, label: 'Users', path: '/admin-users' },
          { icon: <FileText size={20} />, label: 'Exam Results', path: '/admin-upcoming-exams'},
          { icon: <FileText size={20} />, label: 'Mock Tests', path: '/admin-mock-tests' },
          { icon: <Edit size={20} />, label: 'Blog Management', path: '/admin-blog-management' },
          { icon: <Check size={20} />, label: 'Sales Tasks', path: '/admin-tasks' },
          { icon: <Users size={20} />, label: 'Sales Team', path: '/admin-sales-team' },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 md:hidden ${isSidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`min-h-screen bg-education-blue flex flex-col text-white fixed md:static top-0 left-0 z-50 transition-all duration-300 ease-in-out w-[85%] sm:w-72 md:w-60 ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full shadow-none'} md:translate-x-0 md:shadow-none overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 md:px-6 py-6 md:py-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white rounded-full w-9 md:w-10 h-9 md:h-10 flex items-center justify-center">
                <span className="text-education-blue font-bold text-lg md:text-xl">O</span>
              </div>
              <span className="font-bold text-lg md:text-xl">EduVerse</span>
            </Link>
            {isMobile && (
              <button 
                onClick={onClose}
                className="md:hidden flex-shrink-0 p-2 rounded-md hover:bg-blue-800 transition-all duration-200 ease-in-out bg-blue-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                aria-label="Close sidebar"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <X size={24} className="transform transition-all duration-200 hover:rotate-90" />
                </div>
              </button>
            )}
          </div>
          
          <div className="px-4 py-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-blue-600 text-white placeholder-blue-200 px-3 py-2 rounded-md text-sm"
              />
            </div>
          </div>
          
          <nav className="mt-4 md:mt-6 flex-grow">
            <ul className="space-y-1">
              {getNavItems().map((item, index) => (
                <li key={index}>
                  <button
                    className={`flex items-center w-full text-left px-4 md:px-6 py-3 text-sm font-medium rounded-md transition-colors mx-2 ${
                      location.pathname === item.path
                        ? 'bg-white text-education-blue'
                        : 'text-white hover:bg-blue-600'
                    }`}
                    onClick={() => {
                      if (isMobile) onClose();
                      if (onNavigation) {
                        // Use internal navigation if provided
                        onNavigation(item.label.toLowerCase());
                      }
                      // Use React Router's navigate function instead of directly modifying window.location
                      navigate(item.path);
                    }}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="px-4 pb-6 md:pb-8 mt-auto border-t border-blue-600 pt-4">
            <Link to="/settings" className="flex items-center px-4 md:px-6 py-3 text-sm font-medium rounded-md hover:bg-blue-600 transition-colors mx-2">
              <Settings size={20} className="mr-3" />
              <span className="truncate">Settings</span>
            </Link>
            <Link to="/login" className="flex items-center px-4 md:px-6 py-3 text-sm font-medium rounded-md hover:bg-blue-600 transition-colors mx-2">
              <LogOut size={20} className="mr-3" />
              <span className="truncate">Logout</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
