import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Menu, X, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface DashboardHeaderProps {
  title: string;
  userName?: string;
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, userName = 'Rahul Gupta', onMenuToggle, isSidebarOpen = false }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

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

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  const getDashboardRoute = () => {
    if (!user) return "/dashboard";
    
    switch (user.role) {
      case "admin":
        return "/admin-dashboard";
      case "student":
        return "/student-dashboard";
      case "school":
        return "/school-dashboard";
      case "salesman":
        return "/sales-dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="bg-white py-2 md:py-4 px-3 md:px-6 flex items-center justify-between border-b sticky top-0 z-40 shadow-sm">
      {/* Left section */}
      <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
        {onMenuToggle && (
          <button 
            onClick={handleMenuToggle}
            className="flex-shrink-0 p-2 rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out bg-education-blue text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Menu size={20} className={`absolute transform transition-all duration-200 ${isSidebarOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <X size={20} className={`absolute transform transition-all duration-200 ${isSidebarOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} />
            </div>
          </button>
        )}
        
        {/* Brand and navigation */}
        <div className="flex items-center gap-4 overflow-hidden">
          <Link to="/" className="text-xl md:text-2xl font-bold text-education-blue whitespace-nowrap">
            My Olympiad
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 ml-6">
            <Link to="/" className="text-education-dark hover:text-education-blue px-2 py-1 font-medium text-sm">
              Home
            </Link>
            <Link to="/exams" className="text-education-dark hover:text-education-blue px-2 py-1 font-medium text-sm">
              Exams
            </Link>
            <Link to="/mock-tests" className="text-education-dark hover:text-education-blue px-2 py-1 font-medium text-sm">
              Mock Tests
            </Link>
            <Link to="/blog" className="text-education-dark hover:text-education-blue px-2 py-1 font-medium text-sm">
              Blog
            </Link>
            <Link to="/contact" className="text-education-dark hover:text-education-blue px-2 py-1 font-medium text-sm">
              Contact
            </Link>
          </div>
          
          {/* Breadcrumb separator and title for larger screens */}
          <div className="hidden md:flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            <h1 className="text-base md:text-lg font-semibold text-education-dark truncate">{title}</h1>
          </div>
        </div>
      </div>
      
      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-4">
        <button className="relative p-1 hover:bg-gray-100 rounded-full">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="relative">
          <button 
            onClick={toggleUserDropdown}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-education-blue flex items-center justify-center text-white">
              {(user?.name || userName).charAt(0)}
            </div>
            <span className="text-sm font-medium mr-1 hidden sm:inline">{user?.name || userName}</span>
            <ChevronDown size={16} className="text-gray-600 hidden sm:inline" />
          </button>
          
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
              <Link to={getDashboardRoute()} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User size={16} className="mr-2" />
                Dashboard
              </Link>
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
