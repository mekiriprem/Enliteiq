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

const Hero = () => {
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedExams = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://enlightiq.enlightiq.in/api/recommended");

        if (!response.ok) {
          throw new Error(`Failed to fetch recommended exams: ${response.status} ${response.statusText}`);
        }

        const fetchedExams = await response.json();
        setExams(fetchedExams.slice(0, 6));
      } catch (error) {
        console.error("Error fetching recommended exams for Hero:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch exams");

        setExams([
          {
            id: "science-olympiad",
            title: "National Science Olympiad",
            subject: "Science",
            date: "May 15, 2025",
            time: "10:00",
            description: "Comprehensive science examination",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "math-olympiad",
            title: "Mathematics Olympiad",
            subject: "Mathematics",
            date: "June 10, 2025",
            time: "14:00",
            description: "Advanced mathematics competition",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedExams();
  }, []);

  useEffect(() => {
    if (exams.length > 0) {
      const interval = setInterval(() => {
        setCurrentExamIndex((prevIndex) => (prevIndex + 1) % exams.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [exams.length]);

  return (
    <div className="relative">
      {/* Background Watermarks */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="watermark watermark-1">π</div>
        <div className="watermark watermark-2">Σ</div>
        <div className="watermark watermark-3">H₂O</div>
        <div className="watermark watermark-4">√</div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="particle particle-1">∫</div>
        <div className="particle particle-2">∞</div>
        <div className="particle particle-3">Δ</div>
        <div className="particle particle-4">Ω</div>
      </div>

      <div className="container relative z-10 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
          {/* Image */}
          <div className="w-full xl:w-5/12 relative overflow-hidden rounded-lg aspect-[4/3]">
            <img
              src="/ChatGPT_Image_Jun_12__2025__10_58_53_AM-removebg-preview.png"
              alt="Banner"
              className="w-full h-full object-contain rounded-lg shadow"
            />
          </div>

          {/* Text */}
          <div className="w-full xl:w-7/12 mb-10 xl:mb-0 animate-fade-in text-center xl:text-left">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold">
              Elevate Your <span className="text-education-blue">Academic</span> Journey
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto xl:mx-0">
              Join thousands of students preparing for exams through our comprehensive platform. Expert-designed mock tests, personalized feedback, and proven results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center xl:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="btn-primary text-center py-3 px-8 text-lg">
                Get Started
              </Link>
              <Link
                to="/exams"
                className="btn-outline text-center py-3 px-8 text-lg flex items-center justify-center"
              >
                Explore Exams <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue mb-6 animate-fade-in">
              Who We Are
            </h2>
            <p className="text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
              <span className="block font-bold text-blue-500">
                AT ENLIGHTIQ, WE ARE COMMITTED TO TRANSFORMING THE EDUCATIONAL LANDSCAPE
              </span>
              THROUGH TAILORED LEARNING SOLUTIONS THAT BRIDGE ACADEMIC KNOWLEDGE WITH PRACTICAL SKILLS.
              <br />
              <br />
              <span className="block font-bold text-blue-500">
                OUR MISSION IS TO EMPOWER MINDS AND UNLOCK POTENTIAL AT EVERY STAGE OF LEARNING.
              </span>
            </p>
          </div>
        </section>

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

      {/* Styles */}
      <style>
        {`
          .watermark {
            position: absolute;
            font-size: 4rem;
            color: rgba(59, 130, 246, 0.1);
            font-weight: bold;
            pointer-events: none;
            animation: fadeInOut 8s infinite;
          }

          .watermark-1 { top: 10%; left: 5%; }
          .watermark-2 { top: 30%; right: 10%; }
          .watermark-3 { bottom: 20%; left: 15%; }
          .watermark-4 { bottom: 10%; right: 20%; }

          .particle {
            position: absolute;
            font-size: 1.5rem;
            color: rgba(59, 130, 246, 0.3);
            animation: float 15s infinite linear;
          }

          .particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
          .particle-2 { top: 50%; right: 15%; animation-delay: 3s; }
          .particle-3 { bottom: 25%; left: 25%; animation-delay: 6s; }
          .particle-4 { bottom: 15%; right: 30%; animation-delay: 9s; }

          @keyframes fadeInOut {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.2; }
          }

          @keyframes float {
            0% { transform: translateY(0); }
            100% { transform: translateY(-100vh); }
          }
        `}
      </style>
    </div>
  );
};

export default Hero;
