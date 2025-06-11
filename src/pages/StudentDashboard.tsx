import React, { useState, useEffect } from "react";
import ExamResults from "../components/Dashbordspages/examresults";
import UpcomingExams from "../components/Dashbordspages/Upcomingexams";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Trophy, 
  BookOpen, 
  Calendar, 
  Target, 
  User, 
  TrendingUp, 
  Award,
  Download,
  Clock,
  CheckCircle,
  Star,
  Medal,
  GraduationCap,
  FileText,
  Zap,
  Brain
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data - in real app this would come from API
const getMockUserData = () => ({
  name: "Rahul Gupta",
  email: "rahul.gupta@example.com",
  school: "Delhi Public School",
  class: "Class 10",
  joinDate: "September 2023",
  totalExams: 15,
  completedExams: 12,
  upcomingExams: 3,
  averageScore: 87,
  bestScore: 96,
  currentStreak: 8,
  certificates: 7,
  recentResults: [
    { id: 1, examName: "Mathematics Olympiad", score: 94, grade: "A+", date: "2024-01-15", subject: "Mathematics" },
    { id: 2, examName: "Science Quiz Competition", score: 87, grade: "A", date: "2024-01-10", subject: "Science" },
    { id: 3, examName: "English Grammar Test", score: 91, grade: "A+", date: "2024-01-05", subject: "English" }
  ],
  subjectPerformance: [
    { subject: "Mathematics", score: 92, exams: 4, trend: "up" },
    { subject: "Science", score: 85, exams: 3, trend: "up" },
    { subject: "English", score: 89, exams: 3, trend: "stable" },
    { subject: "Social Studies", score: 82, exams: 2, trend: "down" }
  ],
  achievements: [
    { id: 1, title: "Top Performer", description: "Scored above 90% in 5 consecutive exams", icon: "🏆", earned: true },
    { id: 2, title: "Subject Master", description: "Achieved excellence in Mathematics", icon: "🧮", earned: true },
    { id: 3, title: "Consistent Learner", description: "Completed 10 exams", icon: "📚", earned: true },
    { id: 4, title: "Speed Demon", description: "Complete an exam in under 30 minutes", icon: "⚡", earned: false }
  ],
  studyStreak: 15,
  totalStudyHours: 45
});

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'results' | 'upcoming' | 'performance' | 'resources' | 'achievements'>('dashboard');
  const [userData] = useState(getMockUserData());
  const location = useLocation();

  // Listen for navigation events from the DashboardLayout
  useEffect(() => {
    const handleDashboardNavigation = (event: CustomEvent) => {
      const { section, userType } = event.detail;
      if (userType === 'student') {
        if (section === 'exam results') {
          setActiveTab('results');
        } else if (section === 'tests') {
          setActiveTab('upcoming');
        } else if (section === 'dashboard') {
          setActiveTab('dashboard');
        }
      }
    };

    // Add event listener
    document.addEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);
    
    // Clean up
    return () => document.removeEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);
  }, []);
  
  // Check URL path to determine active tab on initial load
  useEffect(() => {
    if (location.pathname === '/student-exam-results') {
      setActiveTab('results');
    } else if (location.pathname === '/upcoming-exams') {
      setActiveTab('upcoming');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview userData={userData} />;
      case 'results':
        return <ExamResults userType="student" />;
      case 'upcoming':
        return <UpcomingExams userType="student" />;
      case 'performance':
        return <PerformanceAnalytics userData={userData} />;
      case 'resources':
        return <StudyResources />;
      case 'achievements':
        return <AchievementsSection userData={userData} />;
      default:
        return <DashboardOverview userData={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header/Navbar */}
      <DashboardHeader title="Student Dashboard" userName={userData.name} />
      
      <div className="p-3 sm:p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'results', label: 'Exam Results', icon: Trophy },
              { id: 'upcoming', label: 'Upcoming Exams', icon: Calendar },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'resources', label: 'Study Resources', icon: BookOpen },
              { id: 'achievements', label: 'Achievements', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-education-blue border-b-2 border-education-blue bg-blue-50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          {/* Tab Content */}
          <div className="overflow-hidden">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC<{ userData: any }> = ({ userData }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {userData.name}! 🎯</h2>
        <p className="text-blue-100">Ready to continue your learning journey? You're doing great!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Exams"
          value={userData.totalExams}
          icon={BookOpen}
          color="blue"
          subtitle="Registered"
        />
        <StatCard
          title="Completed"
          value={userData.completedExams}
          icon={CheckCircle}
          color="green"
          subtitle="Exams finished"
        />
        <StatCard
          title="Average Score"
          value={`${userData.averageScore}%`}
          icon={Target}
          color="purple"
          subtitle="Keep it up!"
        />
        <StatCard
          title="Study Streak"
          value={`${userData.studyStreak} days`}
          icon={Zap}
          color="orange"
          subtitle="Amazing!"
        />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
            Overall Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completion Rate</span>
                <span>{Math.round((userData.completedExams / userData.totalExams) * 100)}%</span>
              </div>
              <Progress value={(userData.completedExams / userData.totalExams) * 100} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Performance Score</span>
                <span>{userData.averageScore}%</span>
              </div>
              <Progress value={userData.averageScore} className="h-3" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-green-500" />
            Recent Results
          </h3>
          <div className="space-y-3">
            {userData.recentResults.slice(0, 3).map((result: any) => (
              <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{result.examName}</p>
                  <p className="text-xs text-gray-500">{result.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">{result.score}%</p>
                  <p className="text-xs text-gray-500">{result.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="mr-2 h-5 w-5 text-purple-500" />
          Subject Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userData.subjectPerformance.map((subject: any, index: number) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{subject.subject}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  subject.trend === 'up' ? 'bg-green-100 text-green-600' :
                  subject.trend === 'down' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {subject.trend === 'up' ? '↗' : subject.trend === 'down' ? '↘' : '→'}
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-1">{subject.score}%</p>
              <p className="text-xs text-gray-500">{subject.exams} exams</p>
              <Progress value={subject.score} className="h-2 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Performance Analytics Component
const PerformanceAnalytics: React.FC<{ userData: any }> = ({ userData }) => {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-xl font-semibold">Performance Analytics</h3>
      
      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Best Score</p>
              <p className="text-3xl font-bold">{userData.bestScore}%</p>
            </div>
            <Trophy className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Current Streak</p>
              <p className="text-3xl font-bold">{userData.currentStreak}</p>
            </div>
            <Star className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Certificates</p>
              <p className="text-3xl font-bold">{userData.certificates}</p>
            </div>
            <Medal className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Detailed Subject Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Subject-wise Analysis</h4>
        <div className="space-y-4">
          {userData.subjectPerformance.map((subject: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium">{subject.subject}</h5>
                <span className="text-lg font-bold text-blue-600">{subject.score}%</span>
              </div>
              <Progress value={subject.score} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{subject.exams} exams completed</span>
                <span className={`font-medium ${
                  subject.trend === 'up' ? 'text-green-600' :
                  subject.trend === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {subject.trend === 'up' ? '↗ Improving' : 
                   subject.trend === 'down' ? '↘ Needs attention' : 
                   '→ Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Study Resources Component
const StudyResources: React.FC = () => {
  const resources = [
    { id: 1, title: "Mathematics Practice Tests", type: "Mock Test", difficulty: "Medium", duration: "60 min" },
    { id: 2, title: "Science Quiz Bank", type: "Quiz", difficulty: "Easy", duration: "30 min" },
    { id: 3, title: "English Grammar Guide", type: "Study Material", difficulty: "Easy", duration: "Read" },
    { id: 4, title: "Advanced Physics Problems", type: "Practice", difficulty: "Hard", duration: "90 min" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Study Resources</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Browse All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-lg">{resource.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                resource.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                resource.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {resource.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {resource.type}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {resource.duration}
              </span>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Start Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Achievements Section Component
const AchievementsSection: React.FC<{ userData: any }> = ({ userData }) => {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-xl font-semibold">Achievements & Badges</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userData.achievements.map((achievement: any) => (
          <div key={achievement.id} className={`p-6 rounded-lg border-2 transition-all ${
            achievement.earned 
              ? 'border-green-200 bg-green-50' 
              : 'border-gray-200 bg-gray-50 opacity-60'
          }`}>
            <div className="text-center">
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h4 className="font-semibold mb-2">{achievement.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              {achievement.earned ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Earned
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  In Progress
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Certificates Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <GraduationCap className="mr-2 h-5 w-5 text-purple-500" />
          Your Certificates
        </h4>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-lg font-semibold mb-2">You have earned {userData.certificates} certificates!</p>
          <p className="text-gray-600 mb-4">Keep up the excellent work to earn more achievements.</p>
          <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 flex items-center mx-auto">
            <Download className="h-4 w-4 mr-2" />
            Download All Certificates
          </button>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: any;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>  );
};

export default StudentDashboard;
