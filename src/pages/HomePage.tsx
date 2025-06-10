
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import TestimonialCard from "../components/home/TestimonialCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowRight, School,
  Users,
  BarChart3,
} from "lucide-react";
import ExamCard from "../components/exams/ExamCard";

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

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for school registration form
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolEmail: "",
    schoolAdminName: "",
    password: "",
    confirmPassword: "",
  });
  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (name === 'schoolEmail') {
      if (value.trim() === '') {
        setEmailError(null);
      } else if (!isValidEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError(null);
      }
    }

    if (name === 'confirmPassword' || name === 'password') {
      const currentPassword = name === 'password' ? value : formData.password;
      const currentConfirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (currentConfirmPassword.trim() === '') {
        setPasswordError(null);
      } else if (currentPassword !== currentConfirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError(null);
      }
    }
  };// State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Real-time validation states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  // Validation function
  const validateForm = () => {
    const errors: string[] = [];

    // Check all required fields
    if (!formData.schoolName.trim()) errors.push("School name is required");
    if (!formData.schoolAddress.trim()) errors.push("School address is required");
    if (!formData.schoolEmail.trim()) errors.push("School email is required");
    if (!formData.schoolAdminName.trim()) errors.push("School admin name is required");
    if (!formData.password.trim()) errors.push("Password is required");
    if (!formData.confirmPassword.trim()) errors.push("Confirm password is required");

    // Email validation
    if (formData.schoolEmail && !isValidEmail(formData.schoolEmail)) {
      errors.push("Please enter a valid email address");
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    // Password strength (optional)
    if (formData.password && formData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    return errors;
  };
  // Handler for form submission
  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) e.preventDefault();
    
    // Reset previous errors/success
    setSubmitError(null);
    setSubmitSuccess(false);
    setEmailError(null);
    setPasswordError(null);

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join('. '));
      return;
    }

    setIsSubmitting(true);

    try {      // Prepare data for API (exclude confirmPassword)
      const apiData = {
        schoolName: formData.schoolName.trim(),
        schoolAddress: formData.schoolAddress.trim(),
        schoolEmail: formData.schoolEmail.trim(),
        schoolAdminName: formData.schoolAdminName.trim(),
        password: formData.password
      };

      const response = await fetch('http://localhost:8081/api/schools/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Registration failed: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('School registration successful:', result);
      
      // Show success message
      setSubmitSuccess(true);      // Reset form
      setFormData({
        schoolName: "",
        schoolAddress: "",
        schoolEmail: "",
        schoolAdminName: "",
        password: "",
        confirmPassword: "",
      });

      // Clear real-time validation errors
      setEmailError(null);
      setPasswordError(null);

      // Close modal after a short delay to show success message
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error registering school:', error);
      setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

   const [featuredExams, setFeaturedExams] = useState<Exam[]>([]);
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
        
        const exams = await response.json();
        console.log('Fetched recommended exams:', exams);
        
        // Take first 3 exams for featured section
        setFeaturedExams(exams.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recommended exams:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch exams');
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

  // Sample data for testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student, Grade 10",
      content: "EduVerse helped me prepare for my science olympiad. The mock tests were incredibly similar to the actual exam, which gave me the confidence I needed to succeed.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Parent",
      content: "As a parent, I appreciate the detailed progress reports that help me understand where my child needs additional support. The platform is intuitive and comprehensive.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 4,
    },
    {
      name: "Emma Wilson",
      role: "School Coordinator",
      content: "Managing multiple students through EduVerse has streamlined our exam preparation process. The analytics provide valuable insights for our teaching strategy.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5,
    },
  ];
  return (
    <div>
      <Hero />
      <Features />

      {/* Featured Exams Section */}
      <section className="py-16 bg-gray-50">
        <div className="education-container">
          <div className="flex justify-between items-center mb-10">
            <Link to="/exams">
              <h2 className="text-3xl font-bold text-education-dark">Featured Exams</h2>
            </Link>
            <Link to="/exams" className="text-education-blue hover:text-blue-700 flex items-center font-medium">
              View All <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-education-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured exams...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-education-blue hover:text-blue-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : featuredExams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredExams.map((exam) => (
                <ExamCard key={exam.id} {...mapExamToCardFormat(exam)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured exams available at the moment.</p>
              <Link to="/exams" className="text-education-blue hover:text-blue-700 font-medium">
                View All Exams
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Skill Development Section */}
      <section className="py-16 bg-gray-50">
        <div className="education-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-education-dark">Skill Development</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Empower students with essential academic, cognitive, communication, personal, and social skills for lifelong success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">📚</span>
                <h3 className="text-xl font-semibold">Academic Skills</h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Reading comprehension</li>
                <li>Writing and grammar</li>
                <li>Mathematics and logical reasoning</li>
                <li>Scientific thinking</li>
                <li>Digital literacy</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">🧠</span>
                <h3 className="text-xl font-semibold">Cognitive & Thinking Skills</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">These skills support decision-making, problem-solving, and creativity.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Critical thinking</li>
                <li>Problem-solving</li>
                <li>Creativity and innovation</li>
                <li>Analytical reasoning</li>
                <li>Memory strategies</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">🗣</span>
                <h3 className="text-xl font-semibold">Communication Skills</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">Enable students to express ideas clearly and build relationships.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Speaking and listening</li>
                <li>Reading and writing</li>
                <li>Public speaking</li>
                <li>Interpersonal communication</li>
                <li>Digital communication (email, chat, etc.)</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">💡</span>
                <h3 className="text-xl font-semibold">Personal & Life Skills</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">Help students grow into responsible, independent individuals.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Time management</li>
                <li>Goal setting</li>
                <li>Self-discipline</li>
                <li>Adaptability</li>
                <li>Basic financial literacy (9&10)</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">🌍</span>
                <h3 className="text-xl font-semibold">Social & Emotional Skills</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">Support students' well-being and relationships with others.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Empathy and kindness</li>
                <li>Teamwork and cooperation</li>
                <li>Conflict resolution</li>
                <li>Resilience and stress management</li>
                <li>Respect for diversity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Schools Section */}
      <section className="py-16 bg-white">
        <div className="education-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-education-dark">For Schools</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Partner with us to provide your students with comprehensive exam preparation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex items-center mb-4 text-education-blue">
                <School size={32} className="mr-3" />
                <h3 className="text-xl font-semibold">School Registration</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Register your school as a partner and gain access to our comprehensive exam preparation platform.
              </p>
              <Link to="/school-registration" className="text-blue-600 hover:text-blue-800 flex items-center font-semibold">
                Learn More <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex items-center mb-4 text-blue-400">
                <Users size={32} className="mr-3" />
                <h3 className="text-xl font-semibold">Bulk Registration</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Register multiple students at once and manage their accounts from a central dashboard.
              </p>
              <Link to="/bulk-registration" className="text-blue-600 hover:text-blue-800 flex items-center font-semibold">
                Learn More <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex items-center mb-4 text-blue-600">
                <BarChart3 size={32} className="mr-3" />
                <h3 className="text-xl font-semibold">Performance Tracking</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Monitor your students' progress and performance with detailed analytics and reports.
              </p>
              <Link to="/performance-tracking" className="text-blue-600 hover:text-blue-800 flex items-center font-semibold">
                Learn More <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
            >
              Become a Partner School
            </button>
          </div>
        </div>
      </section>

      {/* Modal for School Registration Form */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-all duration-500"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-0 sm:scale-100"
            onClick={(e) => e.stopPropagation()}
          >            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">School Registration</h2>
            
            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm text-center">
                  Registration successful! Welcome to EduVerse.
                </p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">
                  {submitError}
                </p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolName">
                  School Name
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter school name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolAddress">
                  School Address
                </label>
                <input
                  type="text"
                  name="schoolAddress"
                  value={formData.schoolAddress}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter school address"
                  required
                />
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolEmail">
                  School Email
                </label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={formData.schoolEmail}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base transition-all duration-200 ${
                    emailError 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter school email"
                  required
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolAdminName">
                  School Admin Name
                </label>
                <input
                  type="text"
                  name="schoolAdminName"
                  value={formData.schoolAdminName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter admin name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter password"
                  required
                />
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base transition-all duration-200 ${
                    passwordError 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Confirm password"
                  required
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
            </div>            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-300"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold transition-all duration-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Olympiad Coordinator Section */}
      <section className="py-16 bg-white">
        <div className="education-container text-center bg-blue-600 text-white rounded-xl border border-blue-200 py-12 px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Become an Olympiad Coordinator</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our team of dedicated educators and help students excel in competitive exams. As a coordinator, you'll organize exams, provide guidance, and connect schools with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-y-4 sm:gap-x-4">
            <Link
              to="/coordinator-application"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-all duration-shadow-sm"
            >
              Apply Now
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-md transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="education-container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Hear from students, parents, and schools who have experienced success with EduVerse.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;