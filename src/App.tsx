import React, { useState, useMemo, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRedirect from "./components/auth/AuthRedirect";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import ExamsPage from "./pages/ExamsPage";
import MockTestsPage from "./pages/MockTestsPage"; // Add this import
import MockTestPage from "./pages/mock-test/MockTestPage"; // Add this import
import ExamDetailPage from "./pages/ExamDetailPage";
import ExamResultPage from "./pages/ExamResultPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import DashboardPage from "./pages/DashboardPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import SalesDashboard from "./pages/SalesDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import SchoolDetails from "./pages/SchoolDetails";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ExamResultsPage from "./components/Dashbordspages/examresults";
import Login from "./pages/Login";

import Forgotpassword from "./pages/ForgotPassword";

import SalesTeam from "./components/Dashbordspages/Salesteam";
import Schools from "./components/Dashbordspages/Schools";
import Tasks from "./components/Dashbordspages/Tasks";
import UpcomingExams from "./components/Dashbordspages/Upcomingexams";

 



import DashboardLayout from "./components/dashboard/DashboardLayout";
import TaskDetail from "./components/Dashbordspages/TaskDetail";

import SchoolDetail from './pages/SchoolDetails';


const queryClient = new QueryClient();

// Define interface for layout components
interface WithLayoutProps {
  userType: 'student' | 'admin' | 'school' | 'sales';
}

// Dashboard Routes with Layout
const StudentDashboardWithLayout = () => (
  <DashboardLayout userType="student" title="Student Dashboard" userName="Rahul Gupta">
    <StudentDashboard />
  </DashboardLayout>
);

const SchoolDashboardWithLayout = () => (
  <DashboardLayout userType="school" title="School Dashboard" userName="Delhi Public School">
    <SchoolDashboard />
  </DashboardLayout>
);

const SalesDashboardWithLayout = () => (
  <DashboardLayout userType="sales" title="Sales Dashboard" userName="Sales Team">
    <div className="p-0">
      <SalesDashboard />
    </div>
  </DashboardLayout>
);

const AdminDashboardWithLayout = () => (
  <DashboardLayout userType="admin" title="Admin Dashboard" userName="Admin">
    <div className="p-0">
      <AdminDashboard />
    </div>
  </DashboardLayout>
);

// Dashboard Pages with Layout
const StudentExamResultsWithLayout = () => (
  <DashboardLayout userType="student" title="Exam Results" userName="Rahul Gupta">
    <div className="p-3 sm:p-4 md:p-6">
      <ExamResultsPage userType="student" />
    </div>
  </DashboardLayout>
);

const AdminExamResultsWithLayout = () => (
  <DashboardLayout userType="admin" title="Exam Results" userName="Admin">
    <div className="p-3 sm:p-4 md:p-6">
      <ExamResultsPage userType="admin" />
    </div>
  </DashboardLayout>
);

const SchoolExamResultsWithLayout = () => (
  <DashboardLayout userType="school" title="Exam Results" userName="Delhi Public School">
    <div className="p-3 sm:p-4 md:p-6">
      <ExamResultsPage userType="school" />
    </div>
  </DashboardLayout>
);

const SalesTeamWithLayout = () => (
  <DashboardLayout userType="sales" title="Sales Team" userName="Sales Manager">
    <div className="p-3 sm:p-4 md:p-6">
      <SalesTeam />
    </div>
  </DashboardLayout>
);

// Schools component with proper type handling 
const SchoolsWithLayout: React.FC<WithLayoutProps> = ({ userType }) => {
  const userName = userType === 'student' ? 'Rahul Gupta' : 
                 userType === 'school' ? 'Delhi Public School' : 
                 userType === 'sales' ? 'Sales Team' : 'Admin';
  const title = userType === 'school' ? 'Students' : 'Schools';
                 
  return (
    <DashboardLayout userType={userType} title={title} userName={userName}>
      <div className="p-3 sm:p-4 md:p-6">
        <Schools userType={userType} />
      </div>
    </DashboardLayout>
  );
};

// Tasks component with proper type handling
const TasksWithLayout: React.FC<WithLayoutProps> = ({ userType }) => {
  const userName = userType === 'student' ? 'Rahul Gupta' : 
                 userType === 'school' ? 'Delhi Public School' : 
                 userType === 'sales' ? 'Sales Team' : 'Admin';
                 
  return (
    <DashboardLayout userType={userType} title="Tasks" userName={userName}>
      <div className="p-3 sm:p-4 md:p-6">
        <Tasks userType={userType} />
      </div>
    </DashboardLayout>
  );
};

// Upcoming Exams component with proper type handling
const UpcomingExamsWithLayout: React.FC<WithLayoutProps> = ({ userType }) => {
  const userName = userType === 'student' ? 'Rahul Gupta' : 
                 userType === 'school' ? 'Delhi Public School' : 
                 userType === 'sales' ? 'Sales Team' : 'Admin';
                 
  return (
    <DashboardLayout userType={userType} title="Upcoming Exams" userName={userName}>
      <div className="p-3 sm:p-4 md:p-6">
        <UpcomingExams userType={userType} />
      </div>
    </DashboardLayout>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <HashRouter>
          <ScrollToTop /> {/* Add this component */}
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/exam/:id" element={<ExamDetailPage />} />
              <Route path="/mock-tests" element={<MockTestsPage />} />
              <Route path="/mock-tests/:id" element={<MockTestPage />} />
              <Route path="/exam-results/:id" element={<ExamResultPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              <Route path="/forgotpassword" element={<Forgotpassword />} />

              {/* Auth Redirect - determines dashboard based on role */}
              <Route path="/dashboard" element={<AuthRedirect />} />

              {/* Protected Dashboard Routes */}
              <Route path="/student-dashboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboardWithLayout />
                </ProtectedRoute>
              } />
              <Route path="/school-dashboard" element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolDashboardWithLayout />
                </ProtectedRoute>
              } />
              <Route path="/sales-dashboard" element={
                <ProtectedRoute allowedRoles={['salesman']}>
                  <SalesDashboardWithLayout />
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardWithLayout />
                </ProtectedRoute>
              } />

              {/* Protected Student Pages */}
              <Route path="/student-exam-results" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentExamResultsWithLayout />
                </ProtectedRoute>
              } />
              <Route path="/student-upcoming-exams" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout userType="student" title="Upcoming Exams" userName="Rahul Gupta">
                    <div className="p-3 sm:p-4 md:p-6">
                      <UpcomingExams userType="student" />
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Protected Admin Pages */}
              <Route path="/admin-exam-results" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminExamResultsWithLayout />
                </ProtectedRoute>
              } />
              <Route path="/admin-schools" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout userType="admin" title="Schools" userName="Admin">
                    <div className="p-3 sm:p-4 md:p-6">
                      <Schools userType="admin" />
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin-tasks" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout userType="admin" title="Tasks" userName="Admin">
                    <div className="p-3 sm:p-4 md:p-6">
                      <Tasks userType="admin" />
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin-upcoming-exams" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout userType="admin" title="Upcoming Exams" userName="Admin">
                    <div className="p-3 sm:p-4 md:p-6">
                      <UpcomingExams userType="admin" />
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin-sales-team" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout userType="admin" title="Sales Team Management" userName="Admin">
                    <div className="p-3 sm:p-4 md:p-6">
                      <SalesTeam />
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Protected School Pages */}
              <Route path="/school-exam-results" element={
                <ProtectedRoute allowedRoles={['school']}>
                  <SchoolExamResultsWithLayout />
                </ProtectedRoute>
              } />
              <Route path="/school-students" element={
                <ProtectedRoute allowedRoles={['school']}>
                  <DashboardLayout userType="school" title="Students" userName="Delhi Public School">
                    <div className="p-3 sm:p-4 md:p-6">
                      <Schools userType="school" />
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/school-upcoming-exams" element={
                <ProtectedRoute allowedRoles={['school']}>
                  <DashboardLayout userType="school" title="Upcoming Exams" userName="Delhi Public School">
                    <div className="p-3 sm:p-4 md:p-6">
                      <UpcomingExams userType="school" />
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Protected Sales Pages */}
              <Route path="/sales-team" element={
                <ProtectedRoute allowedRoles={['salesman']}>
                  <SalesTeamWithLayout />
                </ProtectedRoute>
              } />
              <Route path="/sales-schools" element={
                <ProtectedRoute allowedRoles={['salesman']}>
                  <DashboardLayout userType="sales" title="Schools" userName="Sales Team">
                    <div className="p-3 sm:p-4 md:p-6">
                      <Schools userType="sales" />
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/sales-tasks" element={
                <ProtectedRoute allowedRoles={['salesman']}>
                  <DashboardLayout userType="sales" title="Tasks" userName="Sales Team">
                    <div className="p-3 sm:p-4 md:p-6">
                      <Tasks userType="sales" />
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Protected Detail Pages */}
              <Route path="/school/:id" element={
                <ProtectedRoute allowedRoles={['admin', 'salesman']}>
                  <SchoolDetail />
                </ProtectedRoute>
              } />
              <Route path="/admin/task/:taskId" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TaskDetail />
                </ProtectedRoute>
              } />

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
            <Footer />
          </div>
        </HashRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
