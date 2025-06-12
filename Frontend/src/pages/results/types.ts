
import { DifficultyType } from "../exams/types";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface ResultState {
  answers: (number | null)[];
  questions: Question[];
  examTitle: string;
  timeSpent: number;
}

export interface DifficultyPerformance {
  easy: { total: number; correct: number };
  medium: { total: number; correct: number };
  hard: { total: number; correct: number };
}

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface DifficultyChartData {
  name: string;
  correct: number;
  incorrect: number;
  total: number;
}

export interface FeedbackData {
  message: string;
  suggestions: string[];
}
