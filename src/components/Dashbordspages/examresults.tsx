import React, { useState, useEffect } from 'react';

// Backend data interfaces
interface UserExamResult {
  examTitle: string;
  subject: string;
  date: string;
  time: string;
  percentage: number | null;
  certificateUrl: string | null;
}

interface ExamResult {
  id: string;
  examName: string;
  subject: string;
  examType: string;
  createdBy: string;
  duration: string;
  score: string;
  percentage: number;
  date: string;
  status: 'completed' | 'pending';
  certificateUrl?: string | null;
}

interface ExamResultsPageProps {
  userType: 'student' | 'admin' | 'school' | 'sales';
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

const ExamResultsPage: React.FC<ExamResultsPageProps> = ({ userType = 'student' }) => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch exam results from backend API
  useEffect(() => {
    const fetchExamResults = async () => {
      if (userType !== 'student') {
        // For non-student users, we might have different logic or show mock data
        // For now, we'll show an empty state
        setResults([]);
        setLoading(false);
        return;
      }

      const loggedInUser = getLoggedInUser();
      if (!loggedInUser || !loggedInUser.id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch exam results from backend API
        const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/users/${loggedInUser.id}/exam-results`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch exam results: ${response.status}`);
        }

        const examResults: UserExamResult[] = await response.json();

        // Transform backend data to frontend format
        const transformedResults: ExamResult[] = examResults.map((result, index) => ({
          id: `${index + 1}`,
          examName: result.examTitle,
          subject: result.subject,
          examType: "Objective", // Default since backend doesn't provide this
          createdBy: "System", // Default since backend doesn't provide this
          duration: result.time || "60 MIN", // Use time or default
          score: result.percentage ? `${result.percentage}/100` : "N/A",
          percentage: result.percentage || 0,
          date: result.date,
          status: 'completed' as const,
          certificateUrl: result.certificateUrl
        }));

        setResults(transformedResults);

      } catch (err) {
        console.error("Error fetching exam results:", err);
        setError(err instanceof Error ? err.message : "Failed to load exam results");
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();
  }, [userType]);

  // Calculate statistics from results
  const totalExams = results.length;
  const averageScore = totalExams > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.percentage, 0) / totalExams)
    : 0;
  const bestScore = totalExams > 0 
    ? Math.max(...results.map(result => result.percentage))
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading exam results...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Results</h3>
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

  return (
    <div>
      <div className="p-3 sm:p-4 md:p-6">
        {/* Statistics Cards */}
        <div className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Exams</h3>
            <p className="text-2xl font-semibold">{totalExams}</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Average Score</h3>
            <p className="text-2xl font-semibold">
              {averageScore}
              <span className="text-sm text-gray-500">%</span>
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Best Score</h3>
            <p className="text-2xl font-semibold">
              {bestScore}
              <span className="text-sm text-gray-500">%</span>
            </p>
          </div>
        </div>
        
        {/* Exam Results Table */}
        <div className="mb-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <h2 className="text-lg font-semibold">Exam Results</h2>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Exam Results</h3>
              <p className="text-gray-600">You haven't completed any exams yet. Start taking exams to see your results here.</p>
            </div>
          ) : (
            <>
              {/* Desktop table view - hidden on mobile */}
              <div className="hidden md:block overflow-x-auto -mx-3 sm:mx-0">
                <table className="w-full table-auto min-w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Exam Name</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Subject</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Score</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Grade</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Certificate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm font-medium">{result.examName}</td>
                        <td className="px-4 py-3 text-sm">{result.subject}</td>
                        <td className="px-4 py-3 text-sm">{new Date(result.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-semibold ${
                            result.percentage >= 80 ? 'text-green-600' :
                            result.percentage >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {result.percentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.percentage >= 80 ? 'bg-green-100 text-green-800' :
                            result.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {calculateGrade(result.percentage)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {result.certificateUrl ? (
                            <a 
                              href={result.certificateUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">Not Available</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile card view - only visible on mobile */}
              <div className="md:hidden space-y-3 mt-4">
                {results.map((result) => (
                  <div key={result.id} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{result.examName}</h3>
                      <span className={`text-sm font-semibold ${
                        result.percentage >= 80 ? 'text-green-600' :
                        result.percentage >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {result.percentage}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Subject</p>
                        <p>{result.subject}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Grade</p>
                        <p>{calculateGrade(result.percentage)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p>{new Date(result.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Certificate</p>
                        {result.certificateUrl ? (
                          <a 
                            href={result.certificateUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResultsPage;
