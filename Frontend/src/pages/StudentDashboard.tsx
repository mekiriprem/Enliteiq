import React, { useState, useEffect } from "react";
import ExamResults from "../components/Dashbordspages/examresults";
import UpcomingExams from "../components/Dashbordspages/Upcomingexams";
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
  Brain,
  AlertCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Backend data interfaces
interface UserExamResult {
  examTitle: string;
  subject: string;
  date: string;
  time: string;
  percentage: number | null;
  certificateUrl: string | null;
}

interface ExamSummary {
  title: string;
  subject: string;
  date: string;
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

interface DashboardData {
  name: string;
  email: string;
  school: string;
  class: string;
  totalExams: number;
  completedExams: number;
  upcomingExams: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number;
  certificates: number;
  recentResults: Array<{
    id: number;
    examName: string;
    score: number;
    grade: string;
    date: string;
    subject: string;
  }>;
  subjectPerformance: Array<{
    subject: string;
    score: number;
    exams: number;
    trend: string;
  }>;
  achievements: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
  }>;
  studyStreak: number;
  totalStudyHours: number;
}

// Function to get logged-in user data from localStorage or sessionStorage  
const getLoggedInUser = () => {
  const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  }
  return null;
};

// Function to calculate grade from percentage
const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "F";
};

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'results' | 'upcoming' | 'performance' | 'achievements'>('dashboard');
  const [userData, setUserData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Fetch data from backend APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      const loggedInUser = getLoggedInUser();
      if (!loggedInUser || !loggedInUser.id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user details
        const userResponse = await fetch(`https://api.infororg.com/api/${loggedInUser.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userResponse.status}`);
        }

        const userDetails: UserData = await userResponse.json();

        // Fetch exam results
        const resultsResponse = await fetch(`https://api.infororg.com/api/users/${loggedInUser.id}/exam-results`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!resultsResponse.ok) {
          throw new Error(`Failed to fetch exam results: ${resultsResponse.status}`);
        }

        const examResults: UserExamResult[] = await resultsResponse.json();

        // Process the data to match our dashboard format
        const completedResults = examResults.filter(result => result.percentage !== null);
        const totalExams = userDetails.registeredExams?.length || 0;
        const completedExams = completedResults.length;
        const upcomingExams = totalExams - completedExams;

        // Calculate average score
        const averageScore = completedResults.length > 0 
          ? Math.round(completedResults.reduce((sum, result) => sum + (result.percentage || 0), 0) / completedResults.length)
          : 0;

        // Calculate best score
        const bestScore = completedResults.length > 0 
          ? Math.max(...completedResults.map(result => result.percentage || 0))
          : 0;

        // Count certificates (results with certificateUrl)
        const certificates = completedResults.filter(result => result.certificateUrl).length;

        // Prepare recent results (last 3 completed exams)
        const recentResults = completedResults
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
          .map((result, index) => ({
            id: index + 1,
            examName: result.examTitle,
            score: result.percentage || 0,
            grade: calculateGrade(result.percentage || 0),
            date: result.date,
            subject: result.subject
          }));

        // Calculate subject performance
        const subjectMap = new Map<string, { scores: number[], total: number }>();
        
        completedResults.forEach(result => {
          if (result.percentage !== null) {
            const subject = result.subject;
            if (!subjectMap.has(subject)) {
              subjectMap.set(subject, { scores: [], total: 0 });
            }
            const subjectData = subjectMap.get(subject)!;
            subjectData.scores.push(result.percentage);
            subjectData.total++;
          }
        });

        const subjectPerformance = Array.from(subjectMap.entries()).map(([subject, data]) => {
          const avgScore = Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length);
          // Simple trend calculation (could be enhanced with historical data)
          const trend = avgScore >= 75 ? 'up' : avgScore >= 60 ? 'stable' : 'down';
          
          return {
            subject,
            score: avgScore,
            exams: data.total,
            trend
          };
        });

        // Mock achievements (could be enhanced with real achievement system)
        const achievements = [
          { 
            id: 1, 
            title: "Top Performer", 
            description: "Scored above 90% in multiple exams", 
            icon: "🏆", 
            earned: completedResults.some(result => (result.percentage || 0) >= 90)
          },
          { 
            id: 2, 
            title: "Subject Master", 
            description: "Achieved excellence in a subject", 
            icon: "🧮", 
            earned: subjectPerformance.some(subject => subject.score >= 85)
          },
          { 
            id: 3, 
            title: "Consistent Learner", 
            description: "Completed multiple exams", 
            icon: "📚", 
            earned: completedExams >= 5
          },
          { 
            id: 4, 
            title: "Certificate Collector", 
            description: "Earned multiple certificates", 
            icon: "⚡", 
            earned: certificates >= 3
          }
        ];

        // Set the processed data
        setUserData({
          name: userDetails.name,
          email: userDetails.email,
          school: userDetails.school || "Not specified",
          class: userDetails.userClass || "Not specified",
          totalExams,
          completedExams,
          upcomingExams,
          averageScore,
          bestScore,
          currentStreak: Math.min(completedExams, 10), // Mock streak calculation
          certificates,
          recentResults,
          subjectPerformance,
          achievements,
          studyStreak: Math.min(completedExams * 2, 30), // Mock study streak
          totalStudyHours: completedExams * 3 // Mock study hours
        });

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!userData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No data available</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview userData={userData} />;
      case 'results':
        return <ExamResults userType="student" />;
      case 'upcoming':
        return <UpcomingExams userType="student" />;      case 'performance':
        return <PerformanceAnalytics userData={userData} />;
      case 'achievements':
        return <AchievementsSection userData={userData} />;
      default:
        return <DashboardOverview userData={userData} />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 sm:p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'results', label: 'Exam Results', icon: Trophy },
              { id: 'upcoming', label: 'Upcoming Exams', icon: Calendar },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
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
                  onClick={() => setActiveTab(tab.id as 'dashboard' | 'results' | 'upcoming' | 'performance' | 'achievements')}
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
const DashboardOverview: React.FC<{ userData: DashboardData }> = ({ userData }) => {
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
                <span>{userData.totalExams > 0 ? Math.round((userData.completedExams / userData.totalExams) * 100) : 0}%</span>
              </div>
              <Progress value={userData.totalExams > 0 ? (userData.completedExams / userData.totalExams) * 100 : 0} className="h-3" />
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
            {userData.recentResults.length > 0 ? (
              userData.recentResults.slice(0, 3).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{result.examName}</p>
                    <p className="text-xs text-gray-500">{new Date(result.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">{result.score}%</p>
                    <p className="text-xs text-gray-500">{result.grade}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No exam results yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="mr-2 h-5 w-5 text-purple-500" />
          Subject Performance
        </h3>
        {userData.subjectPerformance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userData.subjectPerformance.map((subject, index) => (
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
        ) : (
          <p className="text-gray-500 text-center py-4">Complete some exams to see subject performance</p>
        )}
      </div>
    </div>
  );
};

// Performance Analytics Component
const PerformanceAnalytics: React.FC<{ userData: DashboardData }> = ({ userData }) => {
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
        {userData.subjectPerformance.length > 0 ? (
          <div className="space-y-4">
            {userData.subjectPerformance.map((subject, index) => (
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
        ) : (
          <p className="text-gray-500 text-center py-8">Complete some exams to see detailed analysis</p>
        )}
      </div>
    </div>
  );
};

// Achievements Section Component
const AchievementsSection: React.FC<{ userData: DashboardData }> = ({ userData }) => {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-xl font-semibold">Achievements & Badges</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userData.achievements.map((achievement) => (
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
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
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
        </div>        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
