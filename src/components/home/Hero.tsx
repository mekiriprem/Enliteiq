
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Award, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  subject: string;
  description?: string;
  image?: string;
  status?: string | null;
}

const ExamCard = ({ exam }: { exam: {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  image: string;
}}) => {
  return (
    <Link to={`/exam/${exam.id}`} className="lg:w-5/12 lg:pl-8">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <img 
          src={exam.image} 
          alt={exam.title} 
          className="w-full h-64 object-cover object-center"
        />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-blue-100 text-education-blue text-xs font-semibold px-3 py-1 rounded-full">
              {exam.subject}
            </span>
            <span className="text-sm text-gray-500">Starts {exam.date}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
          <p className="text-gray-600 mb-4">Prepare for this {exam.subject.toLowerCase()} exam with our comprehensive mock tests and study materials.</p>
          <div className="text-education-blue font-medium hover:underline flex items-center">
            Learn More <ArrowRight size={16} className="ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const Hero = () => {
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch recommended exams from the API
  useEffect(() => {
    const fetchRecommendedExams = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8081/api/recommended');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch recommended exams: ${response.status} ${response.statusText}`);
        }
        
        const fetchedExams = await response.json();
        console.log('Fetched recommended exams for Hero:', fetchedExams);
        
        // Take first 6 exams for animation
        setExams(fetchedExams.slice(0, 6));
      } catch (error) {
        console.error('Error fetching recommended exams for Hero:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch exams');
        
        // Fallback to sample data if API fails
        setExams([
          {
            id: "science-olympiad",
            title: "National Science Olympiad",
            subject: "Science",
            date: "May 15, 2025",
            time: "10:00",
            description: "Comprehensive science examination",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          },
          {
            id: "math-olympiad",
            title: "Mathematics Olympiad",
            subject: "Mathematics",
            date: "June 10, 2025",
            time: "14:00",
            description: "Advanced mathematics competition",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedExams();
  }, []);
  // Helper function to map backend exam data to ExamCard format
  const mapExamToCardFormat = (exam: Exam) => ({
    id: exam.id,
    title: exam.title,
    subject: exam.subject,
    date: exam.date,
    duration: "2 hours", // Default duration since it's not in backend model
    image: exam.image || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  });

  useEffect(() => {
    if (exams.length > 0) {
      const interval = setInterval(() => {
        setCurrentExamIndex((prevIndex) => (prevIndex + 1) % Math.min(exams.length, 6));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [exams.length]);
  
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-20">
      <div className="education-container">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-education-dark mb-6 leading-tight">
              Elevate Your <span className="text-education-blue">Academic</span> Journey
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              Join thousands of students preparing for exams through our comprehensive platform. Expert-designed mock tests, personalized feedback, and proven results.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="btn-primary text-center py-3 px-8 text-lg">
                Get Started
              </Link>
              <Link to="/exams" className="btn-outline text-center py-3 px-8 text-lg flex items-center justify-center">
                Explore Exams <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>          <div className="lg:w-5/12 lg:pl-8 relative overflow-hidden" style={{ height: '520px' }}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-education-blue"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-red-600 mb-2">Failed to load exams</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-education-blue hover:text-blue-700 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : exams.length > 0 ? (
              exams.slice(0, 6).map((exam, index) => (
                <div
                  key={exam.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentExamIndex
                      ? 'transform translate-x-0 opacity-100' 
                      : 'transform translate-x-full opacity-0'
                  }`}
                >
                  <ExamCard exam={mapExamToCardFormat(exam)} />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">No exams available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">500+</h3>
            <p className="text-gray-600">Mock Tests Available</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">50,000+</h3>
            <p className="text-gray-600">Students Enrolled</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">95%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
