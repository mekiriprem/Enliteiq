
import { FeedbackData, ResultState, DifficultyPerformance, ChartDataItem, DifficultyChartData } from "./types";

// Format time spent
export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let formattedTime = '';
  if (hrs > 0) formattedTime += `${hrs} hr `;
  formattedTime += `${mins} min `;
  formattedTime += `${secs} sec`;
  
  return formattedTime;
};

// Calculate result statistics
export const calculateResultStatistics = (resultData: ResultState) => {
  const totalQuestions = resultData.questions.length;
  const answeredQuestions = resultData.answers.filter(a => a !== null).length;
  const correctAnswers = resultData.answers.reduce((acc, answer, index) => {
    if (answer === resultData.questions[index].correctAnswer) return acc + 1;
    return acc;
  }, 0);
  const incorrectAnswers = answeredQuestions - correctAnswers;
  const notAnswered = totalQuestions - answeredQuestions;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return {
    totalQuestions,
    answeredQuestions,
    correctAnswers,
    incorrectAnswers,
    notAnswered,
    accuracy,
    score
  };
};

// Calculate difficulty-wise performance
export const calculateDifficultyPerformance = (resultData: ResultState): DifficultyPerformance => {
  const difficultyPerformance = {
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 }
  };
  
  resultData.questions.forEach((q, idx) => {
    difficultyPerformance[q.difficulty].total++;
    if (resultData.answers[idx] === q.correctAnswer) {
      difficultyPerformance[q.difficulty].correct++;
    }
  });

  return difficultyPerformance;
};

// Prepare chart data
export const prepareSummaryChartData = (
  correctAnswers: number, 
  incorrectAnswers: number, 
  notAnswered: number
): ChartDataItem[] => {
  return [
    { name: "Correct", value: correctAnswers, color: "#22C55E" },
    { name: "Incorrect", value: incorrectAnswers, color: "#EF4444" },
    { name: "Not Answered", value: notAnswered, color: "#94A3B8" }
  ];
};

export const prepareDifficultyChartData = (
  difficultyPerformance: DifficultyPerformance
): DifficultyChartData[] => {
  return [
    { 
      name: "Easy", 
      correct: difficultyPerformance.easy.correct,
      incorrect: difficultyPerformance.easy.total - difficultyPerformance.easy.correct,
      total: difficultyPerformance.easy.total
    },
    { 
      name: "Medium", 
      correct: difficultyPerformance.medium.correct,
      incorrect: difficultyPerformance.medium.total - difficultyPerformance.medium.correct,
      total: difficultyPerformance.medium.total
    },
    { 
      name: "Hard", 
      correct: difficultyPerformance.hard.correct,
      incorrect: difficultyPerformance.hard.total - difficultyPerformance.hard.correct,
      total: difficultyPerformance.hard.total
    }
  ];
};

// Generate feedback based on score
export const getFeedbackAndNextSteps = (score: number): FeedbackData => {
  if (score >= 80) {
    return {
      message: "Excellent performance! You have a strong grasp of the concepts.",
      suggestions: [
        "Challenge yourself with more difficult problems",
        "Attempt previous year olympiad questions",
        "Consider participating in advanced competitions"
      ]
    };
  } else if (score >= 60) {
    return {
      message: "Good job! You have a decent understanding of most concepts.",
      suggestions: [
        "Focus on the topics where you made mistakes",
        "Practice more medium and hard level problems",
        "Review the theoretical concepts for better clarity"
      ]
    };
  } else {
    return {
      message: "You need more practice to improve your performance.",
      suggestions: [
        "Begin with strengthening your foundational concepts",
        "Practice basic problems before moving to advanced ones",
        "Spend more time on each topic and take guided help"
      ]
    };
  }
};

// Mock data for results page
export const getMockResultData = (): ResultState => {
  return {
    answers: [1, 0, 2, 0, 1, 3, 2, 0, 1, 1],
    questions: [
      {
        id: 1,
        text: "If x² + y² = 25 and x + y = 7, find the value of x × y.",
        options: ["10", "12", "24", "49/4"],
        correctAnswer: 1,
        difficulty: "medium"
      },
      {
        id: 2,
        text: "What is the sum of the first 100 positive integers?",
        options: ["5050", "5000", "5150", "10100"],
        correctAnswer: 0,
        difficulty: "easy"
      },
      {
        id: 3,
        text: "If the sequence a₁, a₂, a₃, ... is defined by a₁ = 3 and aₙ₊₁ = 2aₙ - 1 for all n ≥ 1, what is a₄?",
        options: ["11", "17", "23", "31"],
        correctAnswer: 2,
        difficulty: "medium"
      },
      {
        id: 4,
        text: "What is the value of cos(30°) × cos(60°) - sin(30°) × sin(60°)?",
        options: ["0", "0.25", "0.5", "0.75"],
        correctAnswer: 0,
        difficulty: "medium"
      },
      {
        id: 5,
        text: "How many 4-digit numbers are there such that the digit sum is exactly 9?",
        options: ["84", "126", "220", "330"],
        correctAnswer: 1,
        difficulty: "hard"
      },
      {
        id: 6,
        text: "If the radius of a circle is increased by 50%, by what percentage does the area increase?",
        options: ["50%", "75%", "100%", "125%"],
        correctAnswer: 3,
        difficulty: "easy"
      },
      {
        id: 7,
        text: "What is the sum of all the interior angles of a regular octagon?",
        options: ["540°", "720°", "1080°", "1440°"],
        correctAnswer: 2,
        difficulty: "medium"
      },
      {
        id: 8,
        text: "Solve for x: log₄(x) + log₄(4x) = 3",
        options: ["2", "4", "8", "16"],
        correctAnswer: 0,
        difficulty: "hard"
      },
      {
        id: 9,
        text: "How many different ways can 8 people be seated around a circular table?",
        options: ["40320", "5040", "56", "1"],
        correctAnswer: 1,
        difficulty: "medium"
      },
      {
        id: 10,
        text: "If a and b are the roots of the equation x² - 5x + 6 = 0, what is the value of a² + b²?",
        options: ["13", "25", "30", "37"],
        correctAnswer: 1,
        difficulty: "medium"
      }
    ],
    examTitle: "Mathematics Olympiad Mock Test",
    timeSpent: 1950 // in seconds
  };
};
