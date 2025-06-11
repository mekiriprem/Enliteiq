export interface ExamData {
  id: string;
  title: string;
  subject: string;
  date?: string; // Added to match new structure
  duration: number; // in minutes
  totalQuestions: number;
  instructions: string[];
}

export interface Question {
  id: number;
  questionText: string; // Changed from 'text' to 'questionText'
  options: string[];
  correctAnswer: number | null; // Changed to allow null
  difficulty?: string; // Optional, to maintain compatibility
}