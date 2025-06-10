import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, BookOpen, Clock, School, SchoolIcon } from "lucide-react";
import UpcomingExams from "../components/Dashbordspages/Upcomingexams";
import ExamResults from "../components/Dashbordspages/examresults";

interface School {
  id: string;
  name: string;
  totalStudents: number;
}

const SchoolDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'exams' | 'students'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const schools: School[] = [
    {
      id: '1',                 
      name: 'Delhi Public School',
      totalStudents: 1500,
    },
    {
      id: '2',
      name: 'St. Xavier’s School',
      totalStudents: 1200,
    },
    {
      id: '3',
      name: 'Ryan International School',
      totalStudents: 1800,
    },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    const handleDashboardNavigation = (event: CustomEvent) => {
      const { section, userType } = event.detail;
      if (userType === 'school') {
        if (section === 'dashboard') {
          setActiveSection('dashboard');
        } else if (section === 'students') {
          setActiveSection('students');
        } else if (section === 'exam results') {
          setActiveSection('students');
        } else if (section === 'tests') {
          setActiveSection('exams');
        }
      }
    };

    document.addEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      document.removeEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);
    };
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSchoolClick = (schoolId: string) => {
    navigate(`/admin/school/${schoolId}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'exams':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Test Management</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="flex border-b border-gray-200">
                <button className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                  Upcoming Tests
                </button>
              </div>
              <UpcomingExams userType="school" />
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Student Results</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex border-b border-gray-200">
                <button className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                  Exam Results
                </button>
              </div>
              <ExamResults userType="school" />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                  <p className="text-2xl font-semibold">1,450</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <UserCheck className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Active Classes</h3>
                  <p className="text-2xl font-semibold">42</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Upcoming Tests</h3>
                  <p className="text-2xl font-semibold">8</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pending Results</h3>
                  <p className="text-2xl font-semibold">3</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Class Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <SchoolIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Grade 10</h3>
                      <p className="text-sm text-gray-600">Students: 320</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <SchoolIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Grade 11</h3>
                      <p className="text-sm text-gray-600">Students: 295</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <SchoolIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Grade 12</h3>
                      <p className="text-sm text-gray-600">Students: 285</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Student Results</h3>
                <p className="text-sm text-gray-600 mb-4">
                  View and manage student exam results and performance analytics.
                </p>
                <button
                  onClick={() => navigate('/school-exam-results')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  View Results
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Tests</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule and manage upcoming tests and examinations for your students.
                </p>
                <button
                  onClick={() => navigate('/school-upcoming-exams')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Manage Tests
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default SchoolDashboard;