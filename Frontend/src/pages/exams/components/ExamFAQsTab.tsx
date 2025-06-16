
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ExamFAQ {
  id: string;
  question: string;
  answer: string;
}

const ExamFAQsTab = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Dummy FAQ data
  const faqs: ExamFAQ[] = [
    {
      id: "1",
      question: "What is the exam format?",
      answer: "The exam consists of multiple-choice questions, short answer questions, and problem-solving sections. The total duration is typically 2-3 hours depending on the specific olympiad."
    },
    {
      id: "2",
      question: "What materials can I bring to the exam?",
      answer: "Generally, you can bring pens, pencils, erasers, and a calculator (if specified). Books, notes, and electronic devices are typically not allowed. Check the specific exam guidelines for detailed information."
    },
    {
      id: "3",
      question: "How is the exam scored?",
      answer: "The exam is scored based on correct answers, with different weightage for different sections. There may be negative marking for incorrect answers in multiple-choice sections. Detailed scoring criteria will be provided in the exam instructions."
    },
    {
      id: "4",
      question: "When will the results be announced?",
      answer: "Results are typically announced within 2-4 weeks after the exam date. You will be notified via email and can also check your results on the student dashboard."
    },
    {
      id: "5",
      question: "What happens if I miss the exam?",
      answer: "If you miss the scheduled exam due to unforeseen circumstances, please contact the exam coordinator immediately. Make-up exams may be available in exceptional cases with proper documentation."
    },
    {
      id: "6",
      question: "Can I get my answer sheet back?",
      answer: "Answer sheets are typically not returned to students. However, you can request a detailed score breakdown which will show your performance in different sections of the exam."
    },
    {
      id: "7",
      question: "How do I prepare for the exam?",
      answer: "Use the study materials provided in the Resources tab, practice with mock tests, and review past olympiad questions. Focus on understanding concepts rather than memorization."
    },
    {
      id: "8",
      question: "Is there any registration fee?",
      answer: "Registration fees vary by exam type and level. Please check the exam details page for specific fee information. Some exams may be offered free of charge."
    }
  ];

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-3 dark:text-white">Frequently Asked Questions</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Find answers to common questions about this exam.
      </p>
      
      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id} className="border dark:border-gray-700">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => toggleFAQ(faq.id)}
            >
              <CardTitle className="flex items-center justify-between text-lg dark:text-white">
                <span>{faq.question}</span>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </CardTitle>
            </CardHeader>
            {expandedFAQ === faq.id && (
              <CardContent className="pt-0">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Still have questions?
          </h3>
          <p className="text-blue-700 dark:text-blue-200 text-sm">
            Contact our support team at{" "}
            <a 
              href="mailto:support@enlightiq.com" 
              className="underline hover:text-blue-900 dark:hover:text-blue-100"
            >
              support@enlightiq.com
            </a>{" "}
            or call us at +1 (555) 123-4567 for additional assistance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamFAQsTab;
