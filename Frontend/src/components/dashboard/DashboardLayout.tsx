import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'student' | 'admin' | 'school' | 'sales';
  title: string;
  userName: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  userType, 
  title,
  userName
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, isSidebarOpen]);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle navigation from sidebar by dispatching custom events instead of changing routes
  const handleNavigation = (section: string) => {
    // Create and dispatch a custom event that the dashboard components can listen for
    const event = new CustomEvent('dashboard-navigation', {
      detail: { section, userType }
    });
    document.dispatchEvent(event);
    
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden">
      <DashboardSidebar 
        userType={userType} 
        isSidebarOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onNavigation={handleNavigation}
      />
      
      {/* Dark overlay when sidebar is open on mobile */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      <div className="flex-1 w-full max-w-full">
        <DashboardHeader 
          title={title} 
          userName={userName}
          onMenuToggle={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
