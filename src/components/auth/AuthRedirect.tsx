import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthRedirect: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-education-blue"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, redirect to appropriate dashboard
  if (user) {
    const dashboardRoutes = {
      admin: '/admin-dashboard',
      student: '/student-dashboard',
      school: '/school-dashboard',
      salesman: '/sales-dashboard'
    };
    
    const redirectPath = dashboardRoutes[user.role as keyof typeof dashboardRoutes] || '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
};

export default AuthRedirect;
