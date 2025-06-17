import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  // Check for authentication from localStorage/sessionStorage
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    // Check if anyone is logged in by looking for user data or tokens in storage
    const checkLoginStatus = () => {
      // Check for various types of stored authentication data
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      const userSession = localStorage.getItem("userSession") || sessionStorage.getItem("userSession");
      const isAuthenticated = localStorage.getItem("isAuthenticated") || sessionStorage.getItem("isAuthenticated");
      
      // Check if any authentication data exists
      if (userData || token || authToken || accessToken || userSession || isAuthenticated === "true") {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
    };

    // Initial check
    checkLoginStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <footer className="bg-education-dark text-white pt-12 pb-6">
      <div className="education-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex  items-center ">
              <Link to="/" className="flex items-center space-x-2 padding:2px">
                <img
                  src="/ChatGPT_Image_Jun_12__2025__10_58_53_AM-removebg-preview.png"
                  alt="Enlightiq Logo"
                  className="h-12 w-12 object-contain"
                />
              <h1 className="text-3xl font-bold text-yellow-600">Enlightiq</h1>
              </Link>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering students through quality education and exam preparation. Join our platform to excel in your academic journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/enlightiq?igsh=Mm8ycWszb3p2eGgw" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/exams" className="text-gray-300 hover:text-white">Exams</Link>
              </li>
              <li>
                <Link to="/mock-tests" className="text-gray-300 hover:text-white">Mock Tests</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about?tab=faq" className="text-gray-300 hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link to="/about?tab=terms" className="text-gray-300 hover:text-white">Terms of Service</Link>
              </li>
              <li>
                <Link to="/about?tab=terms" className="text-gray-300 hover:text-white">Privacy Policy</Link>
              </li>
              {!userLoggedIn && (
                <>
                  <li>
                    <Link to="/#partner-school" className="text-gray-300 hover:text-white">Invite School</Link>
                  </li>
                  <li>
                    <Link to="/#coordinator" className="text-gray-300 hover:text-white">Become Coordinator</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">              
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <a 
                  href="https://maps.google.com/maps?ll=17.453802,78.389876&z=22&t=m&hl=en&gl=IN&mapclient=embed&cid=3800074837228319126"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Aishwarya towers, Ayyapa Society, Madhapur , Hyderabad ,Telangana 500081
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <a href="tel:+919652012388" className="text-gray-300 hover:text-white">+91 96520 12388</a>
                </li>
                
             <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <a href="tel:+917075916202" className="text-gray-300 hover:text-white">+91 70759 16202 </a>
               </li>
           
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <a href="mailto:collaborations@enlightiq.in" className="text-gray-300 hover:text-white">collaborations@enlightiq.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Enlightiq. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
