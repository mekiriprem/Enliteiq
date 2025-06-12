import { ExamData, Question } from "./types";

// Mock exam data
export const mockExamData: ExamData = {
  id: "1",
  title: "Science Olympiad - Set 1",
  subject: "Science",
  date: "2025-06-15",
  duration: 60, // Default value, assuming similar to previous data
  totalQuestions: 5, // Based on the number of questions provided
  instructions: [
    "Read each question carefully before answering.",
    "Each question has only one correct answer.",
    "There is no negative marking for wrong answers.",
    "You can navigate between questions using the navigation panel.",
    "You can mark questions for review and come back to them later.",
  ],
};

// Mock questions data
export const mockQuestions: Question[] = [
  {
    id: 1,
    questionText: "What is the chemical formula for water?",
    options: ["CO2", "H2O", "O2", "NaCl"],
    correctAnswer: null,
    difficulty: "easy", // Added default difficulty
  },
  {
    id: 2,
    questionText: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    correctAnswer: null,
    difficulty: "easy", // Added default difficulty
  },
  {
    id: 3,
    questionText: "How many bones are there in the adult human body?",
    options: ["206", "208", "210", "212"],
    correctAnswer: null,
    difficulty: "medium", // Added default difficulty
  },
  {
    id: 4,
    questionText: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: null,
    difficulty: "medium", // Added default difficulty
  },
  {
    id: 5,
    questionText: "Which vitamin is produced when a person is exposed to sunlight?",
    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    correctAnswer: null,
    difficulty: "medium", // Added default difficulty
  },
];