import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Question, MockTestState, ExamData } from "./types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Components
import Instructions from "./components/Instructions";
import QuestionContent from "./components/QuestionContent";
import TimerProgress from "./components/TimerProgress";
import QuestionPalette from "./components/QuestionPalette";

const MockTestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for exam data and questions
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    // State variables
  const [state, setState] = useState<MockTestState>({
    currentQuestion: 0,
    selectedAnswers: [],
    markedForReview: [],
    timeLeft: 0, // Will be set when data loads
    testSubmitted: false
  });

  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch exam data from API
  useEffect(() => {
    const fetchExamData = async () => {
      if (!id) {
        setError("No exam ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/matchsets/${id}/details`);
        if (!response.ok) {
          throw new Error(`Failed to fetch exam data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match our ExamData interface
        const transformedExamData: ExamData = {
          id: data.id.toString(),
          title: data.title,
          subject: data.subject,
          date: data.date,
          duration: data.durationMinutes || 60, // Default to 60 minutes if null
          totalQuestions: data.questions.length,
          instructions: [
            "Read each question carefully before selecting your answer.",
            "You can navigate between questions using the question palette.",
            "Mark questions for review if you want to revisit them later.",
            "Submit your test before the time runs out.",
            "Once submitted, you cannot change your answers."
          ]
        };        // Transform questions data
        const transformedQuestions: Question[] = data.questions.map((q: {
          id: number;
          questionText: string;
          options: string[];
          correctAnswer: number | null;
          durationMinutes: number | null;
        }) => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          difficulty: 'medium' // Default difficulty since API doesn't provide it
        }));

        setExamData(transformedExamData);
        setQuestions(transformedQuestions);
        
        // Initialize state arrays with correct length
        setState(prev => ({
          ...prev,
          selectedAnswers: Array(transformedQuestions.length).fill(null),
          markedForReview: Array(transformedQuestions.length).fill(false),
          timeLeft: transformedExamData.duration * 60 // Convert minutes to seconds
        }));
        
      } catch (error) {
        console.error('Error fetching exam data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load exam data');
      } finally {
        setIsLoading(false);
      }
    };    fetchExamData();
  }, [id]);
  // Handle actual submit test
  const handleSubmitTest = useCallback(async () => {
    if (!examData || !id) return;
    
    setState(prev => ({ ...prev, testSubmitted: true }));
    setShowSubmitDialog(false);
      // Prepare submission data - convert index to option letter (A, B, C, D)
    const selectedAnswersData = state.selectedAnswers.map((answer, index) => {
      if (answer === null) return null;
      
      const question = questions[index];
      if (!question) return null;
      
      // Convert answer index to the actual option text
      const selectedOptionText = question.options[answer];
      
      return {
        questionId: question.id,
        selectedAnswer: selectedOptionText // Send the actual option text
      };    }).filter(item => item !== null);
    
    // Get actual user ID from localStorage
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

    const loggedInUser = getLoggedInUser();
    const studentId = loggedInUser?.id || loggedInUser?.userId || 1; // Fallback to 1 if no user

    const submissionData = {
      matchSetId: parseInt(id), // Use matchSetId instead of examId
      studentId: studentId,
      answers: selectedAnswersData
    };

    console.log('Submitting data:', submissionData);

    try {
      // Submit to API
      const response = await fetch('https://olympiad-zynlogic.hardikgarg.me/api/matchsets/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit test: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Submission result:', result);

      // Clear saved progress
      localStorage.removeItem(`mocktest_${id}_answers`);
      localStorage.removeItem(`mocktest_${id}_marked`);
      localStorage.removeItem(`mocktest_${id}_current`);

      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      }
      
      toast({
        title: "Mock Test Submitted Successfully! 🎉",
        description: "Your answers have been saved. Redirecting to results...",
      });
      
      // Navigate to results page with answers data and results
      setTimeout(() => {
        navigate(`/exam-results/${id}`, { 
          state: { 
            answers: state.selectedAnswers,
            questions: questions,
            examTitle: examData?.title,
            timeSpent: (examData?.duration || 60) * 60 - state.timeLeft,
            result: result // Include the result from backend
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        title: "Submission Failed",
        description: `There was an error submitting your test: ${error.message}`,
        variant: "destructive"
      });
      // Revert submission state
      setState(prev => ({ ...prev, testSubmitted: false }));
    }
  }, [examData, id, state.selectedAnswers, state.timeLeft, questions, navigate, toast]);
  
  // Timer effect
  useEffect(() => {
    if (state.timeLeft > 0 && !state.testSubmitted && !showInstructions) {
      const timer = setTimeout(() => 
        setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 })), 
      1000);
      return () => clearTimeout(timer);
    } else if (state.timeLeft === 0 && !state.testSubmitted) {
      handleSubmitTest();
    }
  }, [state.timeLeft, state.testSubmitted, showInstructions, handleSubmitTest]);

  // Auto-save answers to localStorage
  useEffect(() => {
    if (!showInstructions) {
      localStorage.setItem(`mocktest_${id}_answers`, JSON.stringify(state.selectedAnswers));
      localStorage.setItem(`mocktest_${id}_marked`, JSON.stringify(state.markedForReview));
      localStorage.setItem(`mocktest_${id}_current`, state.currentQuestion.toString());
    }
  }, [state.selectedAnswers, state.markedForReview, state.currentQuestion, id, showInstructions]);

  // Load saved progress on mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`mocktest_${id}_answers`);
    const savedMarked = localStorage.getItem(`mocktest_${id}_marked`);
    const savedCurrent = localStorage.getItem(`mocktest_${id}_current`);
    
    if (savedAnswers && savedMarked && savedCurrent) {
      setState(prev => ({
        ...prev,
        selectedAnswers: JSON.parse(savedAnswers),
        markedForReview: JSON.parse(savedMarked),
        currentQuestion: parseInt(savedCurrent)
      }));
    }
  }, [id]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Prevent page refresh/close during test
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!state.testSubmitted && !showInstructions) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.testSubmitted, showInstructions]);
    // Calculate progress
  const answeredQuestions = state.selectedAnswers.filter(answer => answer !== null).length;
  const progress = questions.length > 0 ? (answeredQuestions / questions.length) * 100 : 0;
  const reviewedQuestions = state.markedForReview.filter(marked => marked).length;
  
  // Handle question navigation
  const goToQuestion = (index: number) => {
    setState(prev => ({ ...prev, currentQuestion: index }));
  };
  
  // Handle answer selection
  const handleSelectAnswer = (answerIndex: number) => {
    setState(prev => {
      const newAnswers = [...prev.selectedAnswers];
      newAnswers[prev.currentQuestion] = answerIndex;
      return { ...prev, selectedAnswers: newAnswers };
    });
  };
  
  // Toggle mark for review
  const toggleMarkForReview = () => {
    setState(prev => {
      const newMarked = [...prev.markedForReview];
      newMarked[prev.currentQuestion] = !newMarked[prev.currentQuestion];
      return { ...prev, markedForReview: newMarked };
    });
  };
    // Handle save and next
  const handleSaveAndNext = () => {
    if (state.currentQuestion < questions.length - 1) {
      setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    }
  };
  
  // Handle previous question
  const handlePrevious = () => {
    if (state.currentQuestion > 0) {
      setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
    }
  };

  // Start test (close instructions)
  const handleStartTest = () => {
    setShowInstructions(false);
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(console.error);
    }
  };
    // Handle submit test confirmation
  const confirmSubmitTest = () => {
    setShowSubmitDialog(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !examData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Exam</h3>
          <p className="text-gray-600 mb-4">{error || "Exam data not found"}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show instructions modal
  if (showInstructions) {
    return (
      <Instructions 
        examData={examData}
        onStartTest={handleStartTest}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="education-container py-3">
          <div className="flex items-center justify-between">            <div>
              <h1 className="text-lg font-semibold text-gray-900">{examData.title}</h1>
              <p className="text-sm text-gray-600">Question {state.currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{answeredQuestions}</span> Answered • 
                <span className="font-medium text-orange-600 ml-1">{reviewedQuestions}</span> Marked
              </div>
              {!isFullscreen && (
                <button
                  onClick={() => document.documentElement.requestFullscreen?.()}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Enter Fullscreen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="education-container py-6">
        {/* Progress Bar */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main test area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question and options */}
          <div className="lg:col-span-3">            <QuestionContent
              question={questions[state.currentQuestion]}
              currentQuestion={state.currentQuestion}
              totalQuestions={questions.length}
              selectedAnswer={state.selectedAnswers[state.currentQuestion]}
              testSubmitted={state.testSubmitted}
              handleSelectAnswer={handleSelectAnswer}
              handlePrevious={handlePrevious}
              handleSaveAndNext={handleSaveAndNext}
              toggleMarkForReview={toggleMarkForReview}
              isMarkedForReview={state.markedForReview[state.currentQuestion]}
            />
          </div>
          
          {/* Sidebar with timer and palette */}
          <div className="lg:col-span-1 space-y-6">            <TimerProgress 
              timeLeft={state.timeLeft}
              progress={progress}
              answeredQuestions={answeredQuestions}
              totalQuestions={questions.length}
            />
            
            <QuestionPalette
              totalQuestions={questions.length}
              currentQuestion={state.currentQuestion}
              selectedAnswers={state.selectedAnswers}
              markedForReview={state.markedForReview}
              goToQuestion={goToQuestion}
              handleSubmitTest={confirmSubmitTest}
            />

            {/* Summary Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Test Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium text-green-600">{answeredQuestions}</span>
                </div>                <div className="flex justify-between">
                  <span className="text-gray-600">Not Answered:</span>
                  <span className="font-medium text-red-600">{questions.length - answeredQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marked for Review:</span>
                  <span className="font-medium text-orange-600">{reviewedQuestions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Mock Test?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to submit your test? This action cannot be undone.</p>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>Answered: <span className="font-medium text-green-600">{answeredQuestions}</span></div>
                  <div>Not Answered: <span className="font-medium text-red-600">{questions.length - answeredQuestions}</span></div>
                  <div>Marked for Review: <span className="font-medium text-orange-600">{reviewedQuestions}</span></div>
                  <div>Time Left: <span className="font-medium text-blue-600">{Math.floor(state.timeLeft / 60)}:{(state.timeLeft % 60).toString().padStart(2, '0')}</span></div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Again</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700">
              Submit Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MockTestPage;
