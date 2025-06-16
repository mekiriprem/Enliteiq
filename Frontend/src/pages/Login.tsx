import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="min-h-screen">
      <div className="education-container">
        <div className="max-w-md mx-auto text-center mb-8">
              <div className="flex justify-center items-center ">
  <Link to="/" className="flex items-center space-x-2 padding:2px">
    <img
      src="/ChatGPT_Image_Jun_12__2025__10_58_53_AM-removebg-preview.png"
      alt="Enlightiq Logo"
      className="h-12 w-12 object-contain"
    />
   <h1 className="text-5xl font-bold text-yellow-600">Enlightiq</h1>
  </Link>
</div>
          <h1 className="mt-6 text-3xl font-bold text-education-dark">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Log in to continue your learning journey</p>
        </div>
        
        <LoginForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By logging in, you agree to our{" "}
            <Link to="/terms" className="text-education-blue hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-education-blue hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
            <div className="floating-symbols">
  <span className="symbol">π</span>
  <span className="symbol">∑</span>
  <span className="symbol">√</span>
  <span className="symbol">≈</span>
  <span className="symbol">∫</span>
  <span className="symbol">⚛</span> {/* Atom symbol */}
  <span className="symbol">🧪</span> {/* Beaker */}
</div>
<div className="fixed-symbols">
  <span className="fixed-symbol" style={{ top: '10%', left: '5%' }}>π</span>
  <span className="fixed-symbol" style={{ top: '30%', right: '10%' }}>∑</span>
  <span className="fixed-symbol" style={{ top: '60%', left: '15%' }}>⚛</span>
  <span className="fixed-symbol" style={{ top: '80%', right: '20%' }}>🧪</span>
</div>
    </div>
  );
};

export default LoginPage;