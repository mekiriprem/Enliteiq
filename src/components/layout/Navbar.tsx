import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu as MenuIcon, X, User, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

interface User {
  name: string;
  role: "admin" | "student" | "user" | "school" | "salesman";
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth() as AuthContextType;
  const location = useLocation();

  // Hide navbar on dashboard routes when user is authenticated
  const isDashboardRoute =
    location.pathname.includes("-dashboard") ||
    location.pathname.includes("/admin-") ||
    location.pathname.includes("/student-") ||
    location.pathname.includes("/school-") ||
    location.pathname.includes("/sales-");

  if (isAuthenticated && isDashboardRoute) {
    return null; // Don't render navbar on dashboard pages
  }

  // Close mobile menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const getDashboardRoute = () => {
    if (!user) return "/student-dashboard";

    switch (user.role) {
      case "admin":
        return "/admin-dashboard";
      case "student":
      case "user":
        return "/student-dashboard";
      case "school":
        return "/school-dashboard";
      case "salesman":
        return "/sales-dashboard";
      default:
        return "/student-dashboard";
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="education-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">Enlightiq</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link to="/" className="text-gray-800 hover:text-blue-600 px-2 py-2 font-medium">
                Home
              </Link>
              <Link to="/ai" className="text-gray-800 hover:text-blue-600 px-2 py-2 font-medium">
                AiLearnings
              </Link>
              <Link to="/exams" className="text-gray-800 hover:text-blue-600 px-2 py-2 font-medium">
                Exams
              </Link>
              <Link to="/mock-tests" className="text-gray-800 hover:text-blue-600 px-2 py-2 font-medium">
                MockTests
              </Link>
              <Link to="/blog" className="text-gray-800 hover:text-blue-600 px-2 py-2 font-medium">
                Blog
              </Link>
              <Link to="/skill-development" className="text-gray-800 hover:text-blue-600 px-2 py-2 font-medium">
                SkillDevelopment
              </Link>
              <Link to="/about" className="text-gray-800 hover:text-blue-600 px-2 py-2 font-medium">
                AboutUs
              </Link>
              <Link to="/contact" className="text-gray-800 hover:text-blue-600 px-2 py-2 font-medium">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:ml-4 sm:space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to={getDashboardRoute()} className="flex items-center text-blue-600 hover:text-blue-700">
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
              <div className="flex items-center space-x-3">
                <Link to="/login" className="flex items-center text-blue-600 hover:text-blue-700">
                  <LogIn size={20} className="mr-1" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn-primary">
                  SignUp
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-blue-600 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
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
            <Link
              to="/"
              className="block px-2 py-1 text-base font-medium text-gray-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/ai"
              className="block px-2 py-1 text-base font-medium text-gray-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              AiLearnings
            </Link>
            <Link
              to="/exams"
              className="block px-2 py-1 text-base font-medium text-gray-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Exams
            </Link>
            <Link
              to="/mock-tests"
              className="block px-2 py-1 text-base font-medium text-gray-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Mock Tests
            </Link>
            <Link
              to="/blog"
              className="block px-2 py-1 text-base font-medium text-gray-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/skill-development"
              className="block px-2 py-1 text-base font-medium text-gray-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              SkillDevelopment
            </Link>
            <Link
              to="/about"
              className="block px-2 py-1 text-base font-medium text-gray-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              AboutUs
            </Link>
            <Link
              to="/contact"
              className="block px-2 py-1 text-base font-medium text-gray-800 hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="pt-3 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to={getDashboardRoute()}
                  className="block px-2 py-1 text-base font-medium text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-2 py-1 text-sm text-gray-600">Welcome, {user?.name}</div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-2 py-1 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 p-2">
                <Link
                  to="/login"
                  className="w-full text-center py-1 text-blue-600 border border-blue-600 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-1 bg-blue-600 text-white rounded-md"
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