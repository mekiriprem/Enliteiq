
import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, X, User, LogIn } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          </div>
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center text-education-blue">
                  <User size={20} className="mr-1" />
                  <span>Dashboard</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center text-education-blue">
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
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoggedIn ? (
              <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-education-blue hover:bg-blue-50">
                Dashboard
              </Link>
            ) : (
              <div className="flex flex-col space-y-2 p-3">
                <Link to="/login" className="w-full text-center py-2 text-education-blue border border-education-blue rounded-md">
                  Login
                </Link>
                <Link to="/register" className="w-full text-center py-2 bg-education-blue text-white rounded-md">
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
