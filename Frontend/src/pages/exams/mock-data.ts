
import { ExamData } from "./types";

export const getMockExamData = (id: string): ExamData => ({
  id: id || "default-id",
  title: "Mathematics Olympiad",
  subject: "Mathematics",
  description: "The Mathematics Olympiad is a prestigious competition designed to identify and nurture mathematical talent among students. Participants will face challenging problems that test their analytical thinking, problem-solving skills, and mathematical creativity.",
  date: "June 10, 2025",
  registrationDeadline: "May 15, 2025",
  duration: "2 hours",
  difficulty: "Medium",
  eligibility: "Open to students in grades 9-12 with a passion for mathematics",
  fee: "$25",
  location: "Online / Remote",
  image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  syllabus: [
    {
      title: "Number Theory",
      topics: ["Prime Numbers", "Divisibility Rules", "Modular Arithmetic", "Diophantine Equations"]
    },
    {
      title: "Algebra",
      topics: ["Polynomials", "Inequalities", "Functional Equations", "Sequences and Series"]
    },
    {
      title: "Geometry",
      topics: ["Euclidean Geometry", "Coordinate Geometry", "Trigonometry", "Transformations"]
    },
    {
      title: "Combinatorics",
      topics: ["Counting Principles", "Permutations and Combinations", "Probability", "Graph Theory"]
    }
  ],
  resources: [
    {
      title: "Recommended Textbooks",
      items: [
        "Problem Solving Strategies by Arthur Engel",
        "Mathematical Olympiad Challenges by Titu Andreescu and Razvan Gelca",
        "The Art and Craft of Problem Solving by Paul Zeitz"
      ]
    },
    {
      title: "Online Resources",
      items: [
        "Khan Academy: Advanced Mathematics",
        "Brilliant.org: Math Problem Solving",
        "Art of Problem Solving Forum"
      ]
    }
  ],
  faqs: [
    {
      question: "How will the exam be conducted?",
      answer: "The exam will be conducted online through our secure examination portal. You will need a computer with a stable internet connection and a webcam for proctoring."
    },
    {
      question: "Can I use a calculator during the exam?",
      answer: "No, calculators are not permitted. The problems are designed to be solved without electronic aids."
    },
    {
      question: "How will the exam be graded?",
      answer: "Each problem will be worth a specified number of points. Partial credit may be awarded for significant progress on a problem even if the final answer is incorrect."
    },
    {
      question: "What happens if I experience technical difficulties during the exam?",
      answer: "If you experience technical difficulties, you can contact our support team immediately. In case of major issues, we may reschedule your exam."
    }
  ]
});
