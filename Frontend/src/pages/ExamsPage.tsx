import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, Calendar, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

const ExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exams from the API
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://olympiad-zynlogic.hardikgarg.me/api/exams");
        if (!response.ok) {
          throw new Error("Failed to fetch exams");
        }
        const data = await response.json();
        // Log the data to verify unique IDs
        console.log("Fetched exams:", data);
        setExams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []); // Empty dependency array means this runs once on mount
  // Filter the exams based on search term and subject
  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      (exam.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (exam.subject?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject ? exam.subject === selectedSubject : true;
    
    return matchesSearch && matchesSubject;
  });

  // Get unique subjects
  const subjects = [...new Set(exams.map(exam => exam.subject).filter(subject => subject))];

  return (
    <div className="min-h-screen">
      <div className="education-container">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4">Available Exams</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse our collection of exams and mock tests to help you prepare for your upcoming academic challenges.
          </p>
        </div>
          {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search bar */}
            <div className="relative mt-[21px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search exams..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Subject filter */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Exam Categories */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-education-dark mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-all cursor-pointer">
              <div className="bg-blue-100 p-2 rounded-full">
                <BookOpen size={24} className="text-education-blue" />
              </div>
              <span className="font-medium">Mathematics</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-all cursor-pointer">
              <div className="bg-green-100 p-2 rounded-full">
                <BookOpen size={24} className="text-green-600" />
              </div>
              <span className="font-medium">Science</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-all cursor-pointer">
              <div className="bg-yellow-100 p-2 rounded-full">
                <BookOpen size={24} className="text-yellow-600" />
              </div>
              <span className="font-medium">English</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-all cursor-pointer">
              <div className="bg-purple-100 p-2 rounded-full">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <span className="font-medium">History</span>
            </div>
          </div>
        </div>
        
        {/* Exams Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-education-dark">All Exams</h2>
            <div className="text-gray-500 text-sm">
              Showing {filteredExams.length} of {exams.length} exams
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-education-dark mb-2">Loading exams...</h3>
              <p className="text-gray-600">Please wait while we fetch the exams.</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-education-dark mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredExams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExams.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/exam/${exam.id}`}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col h-full">
                    <img
                      src={exam.image || "https://images.unsplash.com/photo-1509228623518-827b9141b9d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                      alt={exam.title || "Untitled Exam"}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-xl font-semibold text-education-dark mb-2">
                      {exam.title || "Untitled Exam"}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <strong>ID:</strong> {exam.id}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Subject34:</strong> {exam.subject || "Unknown Subject"}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Date:</strong> {exam.date || "TBD"}
                    </p>                    <p className="text-gray-600 mb-2">
                      <strong>Duration:</strong> {exam.duration || "Not specified"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4 text-gray-400">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-education-dark mb-2">No exams found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          )}
        </div>
        
        {/* Why Take Our Exams Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-education-dark mb-4">Why Take Our Exams?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our exams and mock tests are designed to help you achieve academic excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <Calendar size={32} className="text-education-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-education-dark">Structured Timeline</h3>
              <p className="text-gray-600">
                Our exams follow a structured timeline that helps you prepare systematically for your final assessments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <Clock size={32} className="text-education-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-education-dark">Real Exam Conditions</h3>
              <p className="text-gray-600">
                Experience real exam conditions with our timed tests and authentic question formats.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <Award size={32} className="text-education-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-education-dark">Recognized Certifications</h3>
              <p className="text-gray-600">
                Earn certifications that are recognized by educational institutions and employers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;