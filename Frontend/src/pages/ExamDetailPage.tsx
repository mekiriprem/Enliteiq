import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ExamHeader from "./exams/components/ExamHeader";
import ExamQuickInfo from "./exams/components/ExamQuickInfo";
import ExamActions from "./exams/components/ExamActions";
import ExamOverviewTab from "./exams/components/ExamOverviewTab";
import ExamResourcesTab from "./exams/components/ExamResourcesTab";
import ExamFAQsTab from "./exams/components/ExamFAQsTab";

// Function to get logged-in user data from localStorage or sessionStorage
const getLoggedInUser = () => {
  const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user; // Returns user object with id, userId, name, email, etc.
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  }
  return null;
};

const ExamDetailPage = () => {
  const { id } = useParams(); // Extracts exam id, e.g., "67741591-336d-4d95-bf3b-0262a500e670"
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // Fetch exam details and user data on mount
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://enlightiq.enlightiq.in/api/exams/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch exam details");
        }
        const data = await response.json();
        console.log("Fetched exam data:", data); // Log for debugging
        setExam(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Get logged-in user data
    const loggedInUser = getLoggedInUser();
    setUser(loggedInUser);

    if (id) {
      fetchExam();
    } else {
      setError("No exam ID provided");
      setLoading(false);
    }  }, [id]); // Re-fetch if id changes

  // Handle exam registration
  const handleRegister = async () => {
    if (!user || !user.id) {
      setRegistrationError("Please login to register for the exam");
      return;
    }

    setRegistrationLoading(true);
    setRegistrationError(null);
    setRegistrationStatus(null);

    try {
      const response = await fetch(`https://enlightiq.enlightiq.in/api/user/${user.id}/exam/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });      if (!response.ok) {
        let errorMessage = "Failed to register for the exam";
        
        // Handle specific status codes
        if (response.status === 400) {
          errorMessage = "You are not eligible for this exam or there was an issue with your request.";
        } else if (response.status === 403) {
          errorMessage = "You are not eligible to register for this exam. Please check the eligibility requirements.";
        } else if (response.status === 409) {
          errorMessage = "You are already registered for this exam.";
        } else if (response.status === 500) {
          errorMessage = "Server error occurred. Please try again later.";
        }
        
        // Try to get more specific error message from response
        try {
          const errorText = await response.text();
          if (errorText && errorText.trim()) {
            if (errorText.toLowerCase().includes("user not found")) {
              errorMessage = "User account not found. Please try logging in again.";
            } else if (errorText.toLowerCase().includes("exam not found")) {
              errorMessage = "This exam is no longer available or has been removed.";
            } else if (errorText.toLowerCase().includes("not eligible")) {
              errorMessage = "You are not eligible for this exam. Please check the eligibility requirements.";
            } else if (errorText.toLowerCase().includes("already registered")) {
              errorMessage = "You are already registered for this exam.";
            } else {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.text(); // Expecting text response: "User registered to exam successfully."
      setRegistrationStatus(data || "Successfully registered for the exam!");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to register for the exam. Please try again.";
      setRegistrationError(errorMessage);
    } finally {
      setRegistrationLoading(false);
    }
  };

  // Handle starting mock test
  const handleStartMockTest = () => {
    if (!user) {
      setRegistrationError("Please login to start the mock test");
      return;
    }
    
    // Navigate to mock test page
    navigate(`/mock-test/${id}`);
  };

  // Display loading state for exam fetch
  if (loading) {
    return (
      <div className="min-h-screen ">
        <div className="education-container">
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-education-dark mb-2">Loading exam details...</h3>
            <p className="text-gray-600">Please wait while we fetch the exam information.</p>
          </div>
        </div>
      </div>
    );
  }

  // Display error state for exam fetch
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="education-container">
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-education-dark mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Display not found state for exam
  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="education-container">
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-education-dark mb-2">Exam Not Found</h3>
            <p className="text-gray-600">No exam found for ID: {id}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="education-container">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">          {/* Exam Header */}
          <ExamHeader 
            title={exam.title || "Untitled Exam"}
            subject={exam.subject || "Unknown Subject"}
            image={exam.image || "https://images.unsplash.com/photo-1509228623518-827b9141b9d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
          />
          
          {/* Quick Info */}
          <ExamQuickInfo
            date={exam.date || "TBD"}
            duration={exam.duration || "Not specified"}
            fee={exam.fee || "Not specified"}
            location={exam.location || "Not specified"}
          />
          
          {/* Registration Section */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-education-dark mb-4">Register for Exam</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {!user ? (
                <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md">
                  Please login to register for the exam and start the mock test.
                </div>
              ) : (
                <>
                  <button
                    onClick={handleRegister}
                    disabled={registrationLoading || !user}
                    className={`w-full px-4 py-2 bg-education-blue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-education-blue focus:ring-offset-2 ${
                      registrationLoading || !user ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {registrationLoading ? "Registering..." : "Register for Exam"}
                  </button>
                  {registrationStatus && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                      {registrationStatus}
                    </div>
                  )}
                  {registrationError && (
                    <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                      {registrationError}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Action Buttons - Start Mock Test Disabled if Not Logged In */}
          {/* <div className="p-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-education-dark mb-4">Exam Actions</h3>            <div className="bg-gray-50 p-4 rounded-lg">
              <button
                onClick={handleStartMockTest}
                disabled={!user}
                className={`w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
                  !user ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Start Mock Test
              </button>
              {!user && (
                <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
                  Please login to start the mock test.
                </div>
              )}
            </div> */}
          {/* </div> */}
          
          {/* Tabs */}
          <div className="p-6">
            <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <ExamOverviewTab
                  description={exam.description || "No description available"}
                  eligibility={exam.eligibility || "Not specified"}
                  registrationDeadline={exam.registrationDeadline || "TBD"}
                  examDate={exam.date || "TBD"}
                />
              </TabsContent>
                <TabsContent value="resources">
                <ExamResourcesTab examId={id} examData={exam} />
              </TabsContent>
              
              <TabsContent value="faqs">
                <ExamFAQsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export
export default ExamDetailPage;