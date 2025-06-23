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

  const isDashboardRoute =
    location.pathname.includes("-dashboard") ||
    location.pathname.includes("/admin-") ||
    location.pathname.includes("/student-") ||
    location.pathname.includes("/school-") ||
    location.pathname.includes("/sales-");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (isAuthenticated && isDashboardRoute) {
    return null;
  }

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
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
      case "salesman":
        return "/sales-dashboard";
      default:
        return "/student-dashboard";
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <img
              src="/ChatGPT_Image_Jun_12__2025__10_58_53_AM-removebg-preview.png"
              alt="Enlightiq Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-2xl font-bold text-yellow-600">Enlightiq</h1>
          </Link>

          {/* Mobile Menu Button (visible on < md) */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-800 hover:text-blue-600"
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>

          {/* Main Nav (desktop) */}
          <div className="hidden md:flex md:flex-wrap items-center space-x-4">
            {[
              ["Home", "/"],
              ["Ai Learnings", "/ai"],
              ["Exams", "/exams"],
              ["Mock Tests", "/mock-tests"],
              ["Blog", "/blog"],
              ["Skill Development", "/skill-development"],
              ["About Us", "/about"],
              ["Contact", "/contact"],
            ].map(([label, path], i) => (
              <Link
                key={i}
                to={path}
                className="text-gray-800 hover:text-blue-600 font-medium"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardRoute()}
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <User size={18} className="mr-1" /> Dashboard
                </Link>
                <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 flex items-center"
                >
                  <LogOut size={18} className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <LogIn size={18} className="mr-1" /> Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t py-3">
            <div className="space-y-1">
              {[
                ["Home", "/"],
                ["Ai Learnings", "/ai"],
                ["Exams", "/exams"],
                ["Mock Tests", "/mock-tests"],
                ["Blog", "/blog"],
                ["Skill Development", "/skill-development"],
                ["About Us", "/about"],
                ["Contact", "/contact"],
              ].map(([label, path], index) => (
                <Link
                  key={index}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="border-t px-4 py-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardRoute()}
                    className="block text-blue-600 mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">
                    Welcome, {user?.name}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-center py-1 text-blue-600 border border-blue-600 rounded-md mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center py-1 bg-blue-600 text-white rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
