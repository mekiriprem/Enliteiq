import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  BookOpen, 
  Search, 
  Play, 
  Target, 
  Trophy, 
  Zap, 
  Brain, 
  Cpu 
} from "lucide-react";

interface MockTest {
  id: string;
  title: string;
  subject: string;
  duration: string; // in minutes
  totalQuestions: number;
  description: string;
  topics: string[];
  image?: string;
  date?: string;
  time?: string;
}

interface ApiMockTest {
  id: number;
  title: string;
  subject: string;
  date: string;
  durationMinutes: number | null;
  questionCount: number;
}

const MockTestsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Fetch mock tests from API
  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/matchsets');
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Mock test data not found on the server.'
              : `Failed to fetch mock tests: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [data];        // Transform API data to match MockTest interface
        const transformedTests: MockTest[] = dataArray.map((item: ApiMockTest) => ({
          id: item.id.toString(),
          title: item.title,
          subject: item.subject,
          duration: item.durationMinutes ? `${item.durationMinutes}` : "120", // Default 2 hours if null
          totalQuestions: item.questionCount || 50, // Use actual question count from backend
          description: `Comprehensive ${item.subject} mock test to prepare for Olympiad competitions. Practice with carefully curated questions and improve your problem-solving skills.`,
          topics: [
            item.subject,
            "Problem Solving",
            "Critical Thinking", 
            "Analytical Skills",
            "Olympiad Prep"
          ],
          date: item.date, // Use actual date from backend
          image: `https://images.unsplash.com/photo-${item.subject.toLowerCase() === 'science' ? '1532094349884-0f2b85ae2020' : '1635070041078-e363dbe005cb'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`,
        }));
        
        setMockTests(transformedTests);
      } catch (error) {
        console.error('Error fetching mock tests:', error);
        setError(
          error instanceof Error 
            ? error.message 
            : 'Failed to load mock tests. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMockTests();
  }, []);

  // Toggle topics expansion for a specific test
  const toggleTopicsExpansion = (testId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  // Get unique subjects from the loaded tests
  const subjects = ["All", ...Array.from(new Set(mockTests.map(test => test.subject)))];

  // Filter tests based on search and filters
  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "All" || test.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // Component to render topics with expand/collapse functionality
  const TopicsSection = ({ test }: { test: MockTest }) => {
    const isExpanded = expandedTopics[test.id];
    const shouldShowMoreBadge = test.topics.length > 3;
    const topicsToShow = isExpanded ? test.topics : test.topics.slice(0, 3);
    const remainingCount = test.topics.length - 3;

    return (
      <div className="flex flex-wrap gap-1">
        {topicsToShow.map((topic, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {topic}
          </Badge>
        ))}
        {shouldShowMoreBadge && !isExpanded && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
            onClick={() => toggleTopicsExpansion(test.id)}
          >
            +{remainingCount} more
          </Badge>
        )}
        {isExpanded && shouldShowMoreBadge && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-gray-50 hover:text-gray-700 transition-colors"
            onClick={() => toggleTopicsExpansion(test.id)}
          >
            Show less
          </Badge>
        )}
      </div>
    );
  };
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading mock tests...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <BookOpen className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Failed to Load Mock Tests</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/neural-network-bg.png')] bg-cover bg-fixed bg-opacity-90">      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-100 dark:from-blue-900 to-white dark:to-gray-800 text-black dark:text-white">        <div className="education-container py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center space-x-2 animate-fade-in">
              <Brain size={36} className="text-blue-600 dark:text-blue-400" />
              <span>Mock Tests & Practice Exams</span>
            </h1>
            <p className="text-xl text-blue-500 dark:text-blue-300 mb-8 max-w-3xl mx-auto">
              Sharpen your skills with AI-enhanced mock tests for Olympiad preparation. Practice with real exam-like conditions and track your progress.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-blue-800 dark:text-blue-200">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>Realistic Exam Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>Detailed Performance Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="education-container py-12">        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search mock tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>{/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing <span className="font-semibold">{filteredTests.length}</span> mock tests
            {searchTerm && ` for "${searchTerm}"`}
            {selectedSubject !== "All" && ` in ${selectedSubject}`}
          </p>
        </div>

        {/* Mock Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white dark:bg-gray-800 bg-opacity-80">
              {/* Card Header with Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                {test.image ? (
                  <img 
                    src={test.image} 
                    alt={test.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Cpu size={48} className="text-white/80" />
                  </div>                )}
                {/* Subject Badge */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                  <Badge className="bg-blue-500 text-white border-none">
                    {test.subject}
                  </Badge>
                </div>
              </div><CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold line-clamp-2 dark:text-white">
                  {test.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">{test.subject}</p>
              </CardHeader>

              <CardContent className="space-y-4">                {/* Description */}
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {test.description}
                </p>

                {/* Topics */}
                <TopicsSection test={test} />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />                    <span>{test.duration}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{test.totalQuestions}Q</span>
                  </div>
                  {test.date && (
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{new Date(test.date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Link to={`/mock-tests/${test.id}`} className="block w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Start Mock Test
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>        {/* No Results */}
        {filteredTests.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No mock tests found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("All");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Additional Info Section */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-sm p-8 mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-2">
              <Zap size={28} className="text-purple-600" />
              <span>Why Practice with AI-Enhanced Mock Tests?</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our AI-powered mock tests simulate real Olympiad exams, provide instant feedback, and offer personalized insights to boost your performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Realistic Experience</h3>
              <p className="text-sm text-gray-600">
                Experience the exact same environment and time pressure as the real exam.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Performance Analysis</h3>
              <p className="text-sm text-gray-600">
                Get detailed insights into your performance with AI-driven analytics.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-gray-600">
                Receive personalized recommendations to focus on weak areas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating and Fixed Symbols (from AIPage) */}
      <div className="floating-symbols">
        <span className="symbol">π</span>
        <span className="symbol">∑</span>
        <span className="symbol">√</span>
        <span className="symbol">≈</span>
        <span className="symbol">∫</span>
        <Brain size={24} className="symbol text-purple-600" />
        <span className="symbol">🧪</span>
      </div>
      <div className="fixed-symbols">
        <span className="fixed-symbol" style={{ top: '10%', left: '5%' }}>π</span>
        <span className="fixed-symbol" style={{ top: '30%', right: '10%' }}>∑</span>
        <Cpu size={24} className="fixed-symbol text-blue-600" style={{ top: '60%', left: '15%' }} />
        <span className="fixed-symbol" style={{ top: '80%', right: '20%' }}>🧪</span>
      </div>
    </div>
  );
};

export default MockTestsPage;