import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { 
  calculateResultStatistics, 
  prepareSummaryChartData, 
  getFeedbackAndNextSteps,
  getMockResultData
} from "./results/utils";
import { ResultState, Question } from "./results/types";
import ScoreCards from "./results/components/ScoreCards";
import PerformanceCharts from "./results/components/PerformanceCharts";
import FeedbackSection from "./results/components/FeedbackSection";
import QuestionReview from "./results/components/QuestionReview";

// Interface for backend submission result
interface BackendResult {
  totalQuestions: number;
  correctAnswers: String;
  incorrectAnswers: number;
  percentage: number;
  resultStatus: string; // "Pass" or "Fail"
}

// Interface for question from backend
interface BackendQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer?: number | string; // Can be either index number or answer text
}

// Interface for exam details from backend
interface ExamDetails {
  id: number;
  title: string;
  subject: string;
  date: string;
  durationMinutes: number;
  questions: BackendQuestion[];
}

// Interface for saved submission result
interface SavedSubmissionResult {
  examId: string;
  result: BackendResult;
  answers: (number | null)[];
  examTitle: string;
  timeSpent: number;
  timestamp: string;
}

// Utility function to get saved exam result
const getSavedExamResult = (examId: string): SavedSubmissionResult | null => {
  try {
    const saved = localStorage.getItem(`exam_result_${examId}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error parsing saved exam result:', error);
    return null;
  }
};

// Utility function to get all saved exam results
const getAllSavedResults = (): SavedSubmissionResult[] => {
  const results: SavedSubmissionResult[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('exam_result_')) {
      try {
        const result = JSON.parse(localStorage.getItem(key) || '');
        results.push(result);
      } catch (error) {
        console.error('Error parsing saved result:', error);
      }
    }
  }
  return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const ExamResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState(false);
    // Get result data from router state or try to load from localStorage
  const stateData = location.state as {
    answers: (number | null)[];
    questions: BackendQuestion[];
    examTitle: string;
    timeSpent: number;
    result?: BackendResult; // Backend result from submission
  };

  // Try to get saved result if no state data
  const savedResult = !stateData && id ? getSavedExamResult(id) : null;
  
  // Use actual data from state, saved data, or fallback to mock data
  const resultData = stateData || savedResult || getMockResultData();

  // Effect to fetch additional exam details if needed and save submission result
  useEffect(() => {
    const saveAndFetchData = async () => {
      // Save submission result to localStorage for persistence
      if (stateData?.result && id) {
        const submissionResult = {
          examId: id,
          result: stateData.result,
          answers: stateData.answers,
          examTitle: stateData.examTitle,
          timeSpent: stateData.timeSpent,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(`exam_result_${id}`, JSON.stringify(submissionResult));
      }

      // Fetch additional exam details if we don't have complete question data
      if (id && (!stateData?.questions || stateData.questions.length === 0)) {
        setLoading(true);
        try {
          const response = await fetch(`https://olympiad-zynlogic.hardikgarg.me/api/matchsets/${id}/details`);
          if (response.ok) {
            const details: ExamDetails = await response.json();
            setExamDetails(details);
          } else {
            console.warn('Failed to fetch exam details:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching exam details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    saveAndFetchData();
  }, [id, stateData]);

  // Try to load saved result if no state data is available
  useEffect(() => {
    if (!stateData && id) {
      const savedResult = localStorage.getItem(`exam_result_${id}`);
      if (savedResult) {
        try {
          const parsedResult = JSON.parse(savedResult);
          // You could set this to state and use it, but for now we'll just log it
          console.log('Found saved exam result:', parsedResult);
        } catch (error) {
          console.error('Error parsing saved result:', error);
        }
      }
    }
  }, [id, stateData]);  // Transform backend questions to expected format
  const transformedQuestions: Question[] = useMemo(() => {
    // Use questions from state first, then from fetched exam details
    const questionsToTransform = stateData?.questions || examDetails?.questions || [];
    
    return questionsToTransform.map(q => {      // Convert correctAnswer from string to index
      let correctAnswerIndex = 0;
      if (q.correctAnswer && typeof q.correctAnswer === 'string') {
        // Find the index of the correct answer in the options array
        const index = q.options.findIndex(option => 
          option.trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase()
        );
        correctAnswerIndex = index !== -1 ? index : 0;
        
        // Debug log to verify conversion
        console.log(`Question ${q.id}: "${q.correctAnswer}" -> Index ${correctAnswerIndex} (Options: ${q.options})`);
      } else if (typeof q.correctAnswer === 'number') {
        correctAnswerIndex = q.correctAnswer;
      }
      
      return {
        id: q.id,
        text: q.questionText,
        options: q.options,
        correctAnswer: correctAnswerIndex,
        difficulty: "medium" as const // Default difficulty since backend doesn't provide it
      };
    });
  }, [stateData?.questions, examDetails?.questions]);
    // Calculate result statistics
  // If we have a backend result, use those values directly; otherwise calculate from answers
  let totalQuestions: number;
  let correctAnswers: number;
  let incorrectAnswers: number;
  let notAnswered: number;
  let accuracy: number;
  let score: number;
  let answeredQuestions: number;

  if (stateData?.result || savedResult?.result) {
    // Use backend result data (from state or saved)
    const backendResult = stateData?.result || savedResult?.result;
    if (backendResult) {
      totalQuestions = backendResult.totalQuestions;
      correctAnswers = backendResult.correctAnswers;
      incorrectAnswers = backendResult.incorrectAnswers;
      answeredQuestions = correctAnswers + incorrectAnswers;
      notAnswered = totalQuestions - answeredQuestions;
      accuracy = Math.round(backendResult.percentage);
      score = Math.round(backendResult.percentage);
    } else {
      // Fallback defaults
      totalQuestions = 0;
      correctAnswers = 0;
      incorrectAnswers = 0;
      answeredQuestions = 0;
      notAnswered = 0;
      accuracy = 0;
      score = 0;
    }
  } else {
    // Calculate from answers (fallback or mock data)
    const calculatedStats = calculateResultStatistics(resultData as ResultState);
    totalQuestions = calculatedStats.totalQuestions;
    answeredQuestions = calculatedStats.answeredQuestions;
    correctAnswers = calculatedStats.correctAnswers;
    incorrectAnswers = calculatedStats.incorrectAnswers;
    notAnswered = calculatedStats.notAnswered;
    accuracy = calculatedStats.accuracy;
    score = calculatedStats.score;
  }
    // Mock data for ranks and percentiles (could be enhanced to use real data from backend)
  const rankData = {
    rank: 12,
    totalParticipants: 263,
    percentile: Math.max(95, Math.round(score * 0.95)) // Base percentile on score
  };  // Prepare chart data
  const summaryData = prepareSummaryChartData(correctAnswers, incorrectAnswers, notAnswered);
  
  // Create simple overview chart data without difficulty breakdown
  const overviewData = [
    { name: 'Correct', value: correctAnswers, color: '#10B981' },
    { name: 'Incorrect', value: incorrectAnswers, color: '#EF4444' },
    { name: 'Not Answered', value: notAnswered, color: '#6B7280' }
  ];
  
  // Generate feedback based on score
  const feedback = getFeedbackAndNextSteps(score);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="education-container">        {/* Header */}
        <div className="mb-8">
          {loading && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
              Loading additional exam details...
            </div>
          )}
          <h1 className="text-3xl font-bold text-education-dark mb-2">Test Results</h1>
          <p className="text-gray-600">
            {examDetails?.title || stateData?.examTitle || resultData.examTitle || 'Test Completed'}
          </p>
          {examDetails?.subject && (
            <p className="text-sm text-gray-500">Subject: {examDetails.subject}</p>
          )}
          {(stateData?.result || savedResult?.result) && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                (stateData?.result?.resultStatus || savedResult?.result?.resultStatus) === 'Pass' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {stateData?.result?.resultStatus || savedResult?.result?.resultStatus}
              </span>
              {savedResult && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Completed: {new Date(savedResult.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>        {/* Score and rank summary */}
        <ScoreCards 
          score={score}
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          timeSpent={
            stateData?.timeSpent || 
            savedResult?.timeSpent || 
            ('timeSpent' in resultData ? resultData.timeSpent : 0) || 
            0
          }
          rankData={rankData}
        />
          {/* Performance Charts */}
        <PerformanceCharts
          summaryData={summaryData}
          difficultyData={[]} // No difficulty data available from backend
        />
          {/* Feedback and Next Steps */}
        <FeedbackSection feedback={feedback} />        {/* Answer Review - only show if we have question data */}
        {transformedQuestions.length > 0 && (stateData?.answers || savedResult?.answers) && (
          <QuestionReview
            questions={transformedQuestions}
            answers={stateData?.answers || savedResult?.answers || []}
            examId={id}
          />
        )}
      </div>
    </div>
  );
};

export default ExamResultPage;
