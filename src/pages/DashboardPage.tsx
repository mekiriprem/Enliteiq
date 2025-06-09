import { useState, useEffect } from "react";
import {
  ChevronDown,
  BarChart2,
  Calendar,
  BookOpen,
  Award,
  Clock,
  User,
  Bell,
  Settings,
  CheckCircle,
  AlertCircle,
  Download
} from "lucide-react";

// Function to get logged-in user data from localStorage or sessionStorage
const getLoggedInUser = () => {
  const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("Retrieved user data from storage:", user);
      return user;
    } catch (err) {
      console.error("Error parsing user data from storage:", err);
      return null;
    }
  }
  console.log("No user data found in localStorage or sessionStorage");
  return null;
};

const DashboardPage = () => {
  const [userType] = useState("student");
  const [user, setUser] = useState(null);
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      const loggedInUser = getLoggedInUser();

      if (loggedInUser && loggedInUser.userId) {
        try {
          // Fetch user data
          console.log(`Fetching user data for userId: ${loggedInUser.userId}`);
          const userResponse = await fetch(`http://localhost:8081/api/${loggedInUser.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!userResponse.ok) {
            throw new Error(`User API error: ${userResponse.status} ${userResponse.statusText}`);
          }

          const userResponseText = await userResponse.text();
          console.log("Raw user API response:", userResponseText);

          let userData;
          try {
            userData = JSON.parse(userResponseText);
            console.log("Parsed user data:", userData);
          } catch (parseError) {
            throw new Error(`Failed to parse user JSON: ${parseError.message}`);
          }

          // Fetch exam results
          console.log(`Fetching exam results for userId: ${loggedInUser.userId}`);
          const resultsResponse = await fetch(`http://localhost:8081/api/users/${loggedInUser.id}/exam-results`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!resultsResponse.ok) {
            throw new Error(`Exam results API error: ${resultsResponse.status} ${resultsResponse.statusText}`);
          }

          const resultsResponseText = await resultsResponse.text();
          console.log("Raw exam results API response:", resultsResponseText);

          let examResults;
          try {
            examResults = JSON.parse(resultsResponseText);
            console.log("Parsed exam results data:", examResults);
          } catch (parseError) {
            throw new Error(`Failed to parse exam results JSON: ${parseError.message}`);
          }

          // Fetch exams
          console.log("Fetching all exams");
          const examsResponse = await fetch("http://localhost:8081/api/exams", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!examsResponse.ok) {
            throw new Error(`Exams API error: ${examsResponse.status} ${examsResponse.statusText}`);
          }

          const examsResponseText = await examsResponse.text();
          console.log("Raw exams API response:", examsResponseText);

          let exams;
          try {
            exams = JSON.parse(examsResponseText);
            console.log("Parsed exams data:", exams);
          } catch (parseError) {
            throw new Error(`Failed to parse exams JSON: ${parseError.message}`);
          }

          setAllExams(exams);

          // Process user data
          const completedExams = examResults ? examResults.filter(result => result.percentage != null).length : 0;
          const upcomingExams = userData.registeredExams
            ? userData.registeredExams.filter(exam => {
                const examDateTime = new Date(`${exam.date} ${exam.time || "23:59"}`);
                return examDateTime > new Date();
              }).length
            : 0;
          const progress = examResults && examResults.some(result => result.percentage != null)
            ? Math.round(
                examResults
                  .filter(result => result.percentage != null)
                  .reduce((sum, result) => sum + result.percentage, 0) /
                examResults.filter(result => result.percentage != null).length
              )
            : 0;
          const results = examResults
            ? examResults.map((result, index) => ({
                id: index + 1,
                examName: result.examTitle || "Unknown Exam",
                score: result.percentage != null ? `${result.percentage}/100` : "N/A",
                grade: result.percentage != null ? calculateGrade(result.percentage) : "N/A",
                date: result.date || "Unknown Date",
                certificateUrl: result.certificateUrl || null,
              }))
            : [];
          const upcomingEvents = userData.registeredExams
            ? userData.registeredExams
                .filter(exam => {
                  const examDateTime = new Date(`${exam.date} ${exam.time || "23:59"}`);
                  return examDateTime > new Date();
                })
                .map((exam, index) => ({
                  id: index + 1,
                  title: exam.title || "Unknown Event",
                  date: exam.date || "Unknown Date",
                  type: "exam",
                }))
            : [];

          setUser({
            ...userData,
            progress,
            completedExams,
            upcomingExams,
            results,
            upcomingEvents,
            role: "Exam Participant",
            avatar: userData.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36.png?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
          });
        } catch (err) {
          console.error("Error fetching data:", err);
          setError(`Failed to load dashboard data: ${err.message}`);
          setUser({
            ...loggedInUser,
            progress: 0,
            completedExams: 0,
            upcomingExams: 0,
            results: [],
            upcomingEvents: [],
            role: "Exam Participant",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36.png?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
          });
        }
      } else {
        console.log("No valid user data in storage, user not logged in");
        setError("Please log in to view dashboard data.");
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const calculateGrade = (percentage) => {
    if (percentage >= 85) return "A+";
    if (percentage >= 75) return "A";
    if (percentage >= 65) return "B+";
    if (percentage >= 55) return "B";
    if (percentage >= 45) return "C";
    return "D";
  };

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center bg-red-50 p-4 rounded-lg border border-red-200">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center bg-red-50 p-4 rounded-lg border border-red-200">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-600">No user data available. Please log in.</p>
        </div>
      );
    }

    switch (userType) {
      case "student":
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">User Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{user.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-900">{user.userId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">School</p>
                  <p className="font-medium text-gray-900">{user.school || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium text-gray-900">{user.userClass || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <BookOpen size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Completed Exams</h3>
                    <p className="text-3xl font-bold text-blue-600">{user.completedExams}</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full" style={{ width: `${user.progress}%` }} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <Award size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Average Score</h3>
                    <p className="text-3xl font-bold text-green-600">{user.progress}%</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="text-green-500 font-medium">↑ 5%</span>
                  <span className="ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-2 rounded-full mr-4">
                    <Calendar size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Upcoming Exams</h3>
                    <p className="text-3xl font-bold text-yellow-600">{user.upcomingExams}</p>
                  </div>
                </div>
                <a href="#" className="text-blue-500 hover:underline text-sm font-medium flex items-center">
                  View schedule <ChevronDown size={16} className="ml-1" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Recent Results</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {user.results.length > 0 ? (
                      user.results.map((result) => (
                        <tr key={result.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{result.examName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{result.score}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              result.grade.startsWith('A')
                                ? 'bg-green-100 text-green-800'
                                : result.grade.startsWith('B')
                                ? 'bg-blue-100 text-blue-800'
                                : result.grade === 'N/A'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {result.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                             
                              {result.certificateUrl && (
                                <a
                                  href={result.certificateUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800 flex items-center"
                                >
                                  <Download size={16} className="mr-1" />
                                  Certificate
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No recent results available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  View All Results
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-gray-200">
                    {user.upcomingEvents.length > 0 ? (
                      user.upcomingEvents.map((event) => (
                        <li key={event.id} className="py-3">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full mr-3 ${
                                event.type === 'exam' ? 'bg-yellow-100' : 'bg-blue-100'
                              }`}>
                                {event.type === 'exam' ? (
                                  <Clock size={16} className="text-yellow-600" />
                                ) : (
                                  <BookOpen size={16} className="text-blue-600" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <p className="text-sm text-gray-500">{event.date}</p>
                              </div>
                            </div>
                            <a href="#" className="text-blue-600 hover:underline text-sm">
                              Details
                            </a>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="py-3 text-center text-gray-500">
                        No upcoming events.
                      </li>
                    )}
                  </ul>
                </div>
                <div className="p-4 border-t border-gray-200 text-center">
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    View Calendar
                  </a>
                </div>
              </div>
<div className="bg-white rounded-lg shadow-sm border border-gray-200">
  <div className="p-6 border-b border-gray-200">
    <h2 className="text-lg font-semibold text-gray-800">Recommended Tests</h2>
  </div>
  <div className="p-6">
    <ul className="space-y-4">
      {allExams.length > 0 ? (
        allExams.slice(0, 3).map((exam, index) => (
          <li key={exam.id || index} className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">{exam.title || "Unknown Test"}</h4>
                <p className="text-sm text-gray-500">
                  {exam.description || "Explore this test to challenge your skills"}
                </p>
              </div>
              <a
                href="#"
                className="bg-blue-600 text-white py-1.5 px-3 rounded text-sm hover:bg-blue-700"
              >
                Take Test
              </a>
            </div>
          </li>
        ))
      ) : (
        <li className="py-3 text-center text-gray-500">
          No recommended tests available.
        </li>
      )}
    </ul>
  </div>
  <div className="p-4 border-t border-gray-200 text-center">
    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
      Browse All Tests
    </a>
  </div>
</div>
            </div>
          </>
        );
      case "parent":
        return <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">Parent Dashboard Content</div>;
      case "school":
        return <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">School Dashboard Content</div>;
      case "admin":
        return <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">Admin Dashboard Content</div>;
      default:
        return (
          <div className="text-center bg-red-50 p-4 rounded-lg border border-red-200">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-red-600">Invalid user type.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36.png?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"}
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Welcome, {user?.name || "Guest"}
              </h3>
              <p className="text-sm text-gray-500">{user?.role || "Unknown Role"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <User size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex space-x-3">
            <button className="border border-gray-300 text-gray-700 py-1.5 px-3 rounded text-sm hover:bg-gray-100">
              <Clock size={16} className="inline-block mr-1" /> Last 30 Days
            </button>
            <button className="bg-blue-600 text-white py-1.5 px-3 rounded text-sm hover:bg-blue-700">
              <BarChart2 size={16} className="inline-block mr-1" /> View Reports
            </button>
          </div>
        </div>

        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default DashboardPage;