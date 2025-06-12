
export type DifficultyType = "Easy" | "Medium" | "Hard";

export interface ExamSyllabusSection {
  title: string;
  topics: string[];
}

export interface ExamResource {
  title: string;
  items: string[];
}

export interface ExamFAQ {
  question: string;
  answer: string;
}

export interface ExamData {
  id: string;
  title: string;
  subject: string;
  description: string;
  date: string;
  registrationDeadline: string;
  duration: string;
  difficulty: DifficultyType;
  eligibility: string;
  fee: string;
  location: string;
  image: string;
  syllabus: ExamSyllabusSection[];
  resources: ExamResource[];
  faqs: ExamFAQ[];
}
