
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, X, User, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide navbar on dashboard routes when user is authenticated
  const isDashboardRoute = location.pathname.includes('-dashboard') || 
                          location.pathname.includes('/admin-') ||
                          location.pathname.includes('/student-') ||
                          location.pathname.includes('/school-') ||
                          location.pathname.includes('/sales-');
  
  if (isAuthenticated && isDashboardRoute) {
    return null; // Don't render navbar on dashboard pages
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    // Close mobile menu if open
    setIsMenuOpen(false);
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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="education-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-education-blue">My Olympiad</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link to="/" className="text-education-dark hover:text-education-blue px-3 py-2 font-medium">
                Home
              </Link>
              <Link to="/exams" className="text-education-dark hover:text-education-blue px-3 py-2 font-medium">
                Exams
              </Link>
              <Link to="/mock-tests" className="text-education-dark hover:text-education-blue px-3 py-2 font-medium">
                Mock Tests
              </Link>
              <Link to="/blog" className="text-education-dark hover:text-education-blue px-3 py-2 font-medium">
                Blog
              </Link>
              <Link to="/contact" className="text-education-dark hover:text-education-blue px-3 py-2 font-medium">
                Contact
              </Link>
            </div>
          </div>          <div className="hidden sm:flex sm:items-center sm:ml-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardRoute()} className="flex items-center text-education-blue hover:text-blue-700">
                  <User size={20} className="mr-1" />
                  <span>Dashboard</span>
                </Link>
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <LogOut size={20} className="mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center text-education-blue hover:text-blue-700">
                  <LogIn size={20} className="mr-1" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-education-dark hover:text-education-blue focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t">
          <div className="pt-2 pb-4 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-education-dark hover:bg-blue-50">
              Home
            </Link>
            <Link to="/exams" className="block px-3 py-2 text-base font-medium text-education-dark hover:bg-blue-50">
              Exams
            </Link>
            <Link to="/mock-tests" className="block px-3 py-2 text-base font-medium text-education-dark hover:bg-blue-50">
              Mock Tests
            </Link>
            <Link to="/blog" className="block px-3 py-2 text-base font-medium text-education-dark hover:bg-blue-50">
              Blog
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-education-dark hover:bg-blue-50">
              Contact
            </Link>
          </div>          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link 
                  to={getDashboardRoute()} 
                  className="block px-3 py-2 text-base font-medium text-education-blue hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600">Welcome, {user?.name}</div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 p-3">
                <Link 
                  to="/login" 
                  className="w-full text-center py-2 text-education-blue border border-education-blue rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="w-full text-center py-2 bg-education-blue text-white rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
