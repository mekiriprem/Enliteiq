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

interface SchoolStats {
  totalStudents: number;
  activeClasses: number;
  upcomingTests: number;
  pendingResults: number;
}

interface UserData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  userClass: string;
  registeredExams: ExamSummary[];
}

interface ExamSummary {
  title: string;
  subject: string;
  date: string;
}

interface ExamData {
  id: string;
  title: string;
  date: string;
  time: string;
  subject: string;
  description?: string;
}

const SchoolDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'exams' | 'students'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [schoolStats, setSchoolStats] = useState<SchoolStats>({
    totalStudents: 0,
    activeClasses: 0,
    upcomingTests: 0,
    pendingResults: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch school statistics from backend APIs
  const fetchSchoolStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all users to calculate total students and active classes
      const usersResponse = await fetch('https://api.infororg.com/api/getallUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let totalStudents = 0;
      let activeClasses = 0;

      if (usersResponse.ok) {
        const users: UserData[] = await usersResponse.json();
        totalStudents = users.length;
        
        // Count unique classes
        const uniqueClasses = new Set(
          users
            .map(user => user.userClass)
            .filter(userClass => userClass && userClass.trim() !== '')
        );
        activeClasses = uniqueClasses.size;
      } else {
        console.warn('Failed to fetch users:', usersResponse.statusText);
      }

      // Fetch all exams to calculate upcoming tests and pending results
      const examsResponse = await fetch('https://api.infororg.com/api/exams', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let upcomingTests = 0;
      let pendingResults = 0;

      if (examsResponse.ok) {
        const exams: ExamData[] = await examsResponse.json();
        const currentDate = new Date();

        exams.forEach(exam => {
          const examDateTime = new Date(`${exam.date} ${exam.time || '23:59'}`);
          
          if (examDateTime > currentDate) {
            upcomingTests++;
          }
        });

        // Calculate pending results (exams from last 30 days that have ended)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        
        pendingResults = exams.filter(exam => {
          const examDateTime = new Date(`${exam.date} ${exam.time || '23:59'}`);
          return examDateTime < currentDate && examDateTime > thirtyDaysAgo;
        }).length;
      } else {
        console.warn('Failed to fetch exams:', examsResponse.statusText);
      }

      setSchoolStats({
        totalStudents,
        activeClasses,
        upcomingTests,
        pendingResults
      });

    } catch (error) {
      console.error('Error fetching school statistics:', error);
      setError('Failed to load school statistics');
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh statistics
  const refreshStatistics = () => {
    fetchSchoolStatistics();
  };

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

    // Fetch school statistics on component mount
    fetchSchoolStatistics();

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
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={refreshStatistics}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">School Dashboard</h1>
              <button
                onClick={refreshStatistics}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
            </div>
            
            <div className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                  <p className="text-2xl font-semibold">
                    {loading ? "..." : schoolStats.totalStudents.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <UserCheck className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Active Classes</h3>
                  <p className="text-2xl font-semibold">
                    {loading ? "..." : schoolStats.activeClasses}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Upcoming Tests</h3>
                  <p className="text-2xl font-semibold">
                    {loading ? "..." : schoolStats.upcomingTests}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pending Results</h3>
                  <p className="text-2xl font-semibold">
                    {loading ? "..." : schoolStats.pendingResults}
                  </p>
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