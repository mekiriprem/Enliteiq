import React, { useState, useMemo, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
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
            <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/exam/:id" element={<ExamDetailPage />} />
              <Route path="/mock-tests" element={<MockTestsPage />} /> {/* Add this route */}
              <Route path="/mock-tests/:id" element={<MockTestPage />} />
              <Route path="/exam-results/:id" element={<ExamResultPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

              <Route path="/forgotpassword" element={<Forgotpassword />} />
              
              {/* Dashboard Routes - All using the DashboardLayout */}
              <Route path="/student-dashboard" element={<StudentDashboardWithLayout />} />
              <Route path="/school-dashboard" element={<SchoolDashboard />} />
              <Route path="/school/:id" element={<SchoolDetail />} />
              <Route path="/sales-dashboard" element={<SalesDashboardWithLayout />} />
              <Route path="/admin-dashboard" element={<AdminDashboardWithLayout />} />
              <Route path="/schools" element={<Schools userType="admin" />} />
              <Route path="/admin/dashboard" element={<SchoolDashboard />} />
              <Route path="/admin/school/:schoolId" element={<SchoolDetail />} />
              <Route path="/admin/tasks" element={<Tasks userType="admin" />} />
              <Route path="*" element={<div>404 - Page Not Found</div>} />
              <Route path="/admin/task/:taskId" element={<TaskDetail />} />  
              
              {/* Student Dashboard Pages */}
              <Route path="/student-exam-results" element={<StudentExamResultsWithLayout />} />
              <Route path="/student-upcoming-exams" element={
                <DashboardLayout userType="student" title="Upcoming Exams" userName="Rahul Gupta">
                  <div className="p-3 sm:p-4 md:p-6">
                    <UpcomingExams userType="student" />
                  </div>
                </DashboardLayout>
              } />
              
              {/* Admin Dashboard Pages */}
              <Route path="/admin-exam-results" element={<AdminExamResultsWithLayout />} />
              <Route path="/admin-schools" element={
                <DashboardLayout userType="admin" title="Schools" userName="Admin">
                  <div className="p-3 sm:p-4 md:p-6">
                    <Schools userType="admin" />
                  </div>
                </DashboardLayout>
              } />
              <Route path="/admin-tasks" element={
                <DashboardLayout userType="admin" title="Tasks" userName="Admin">
                  <div className="p-3 sm:p-4 md:p-6">
                    <Tasks userType="admin" />
                  </div>
                </DashboardLayout>
              } />              <Route path="/admin-upcoming-exams" element={
                <DashboardLayout userType="admin" title="Upcoming Exams" userName="Admin">
                  <div className="p-3 sm:p-4 md:p-6">
                    <UpcomingExams userType="admin" />
                  </div>
                </DashboardLayout>
              } />
              <Route path="/admin-sales-team" element={
                <DashboardLayout userType="admin" title="Sales Team Management" userName="Admin">
                  <div className="p-3 sm:p-4 md:p-6">
                    <SalesTeam />
                  </div>
                </DashboardLayout>
              } />
              
              {/* School Dashboard Pages */}
              <Route path="/school-exam-results" element={<SchoolExamResultsWithLayout />} />
              <Route path="/school-students" element={
                <DashboardLayout userType="school" title="Students" userName="Delhi Public School">
                  <div className="p-3 sm:p-4 md:p-6">
                    <Schools userType="school" />
                  </div>
                </DashboardLayout>
              } />
              <Route path="/school-upcoming-exams" element={
                <DashboardLayout userType="school" title="Upcoming Exams" userName="Delhi Public School">
                  <div className="p-3 sm:p-4 md:p-6">
                    <UpcomingExams userType="school" />
                  </div>
                </DashboardLayout>
              } />
              
              {/* Sales Dashboard Pages */}
              <Route path="/sales-team" element={<SalesTeamWithLayout />} />
              <Route path="/sales-schools" element={
                <DashboardLayout userType="sales" title="Schools" userName="Sales Team">
                  <div className="p-3 sm:p-4 md:p-6">
                    <Schools userType="sales" />
                  </div>
                </DashboardLayout>
              } />
              <Route path="/sales-tasks" element={
                <DashboardLayout userType="sales" title="Tasks" userName="Sales Team">
                  <div className="p-3 sm:p-4 md:p-6">
                    <Tasks userType="sales" />
                  </div>
                </DashboardLayout>
              } />
              
              {/* Catch-all Route */}

              <Route path="*" element={<NotFound />} />
              <Route path="/sales-dashboard" element={<SalesDashboard />} />
              <Route path="/school-dashboard" element={<SchoolDashboard />} />
              <Route path="/school/:id" element={<SchoolDetails />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/student-exams" element={<ExamResultsPage userType="student" />} />
              <Route path="/student-exam-results" element={<ExamResultsPage userType="student" />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />

              <Route path="/forgotpassword" element={<Forgotpassword />} />

              <Route path="/admin-exam-results" element={<ExamResultsPage userType="admin" />} />
              <Route path="/school-exam-results" element={<ExamResultsPage userType="school" />} />
              <Route path="/sales-team" element={<SalesTeam />} />
              <Route path="/schools" element={<Schools userType="admin" />} />
              <Route path="/tasks" element={<Tasks userType="admin" />} />
              <Route path="/upcoming-exams" element={<UpcomingExams userType="admin" />} />
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
