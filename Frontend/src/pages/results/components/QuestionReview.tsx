
import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Download, CheckCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Question } from "../types";

interface QuestionReviewProps {
  questions: Question[];
  answers: (number | null)[];
  examId?: string;
}

const QuestionReview = ({ questions, answers, examId }: QuestionReviewProps) => {
  const [viewAnswers, setViewAnswers] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center">
          <FileText className="mr-2 h-5 w-5 text-education-blue" />
          Question Review
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setViewAnswers(!viewAnswers)}>
            {viewAnswers ? "Hide Answers" : "Show Answers"}
          </Button>
          <Button variant="outline" className="text-gray-500">
            <Download className="h-4 w-4 mr-1" /> Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const isAnswered = userAnswer !== null;
            
            // Debug log to verify comparison
            console.log(`Question ${index + 1}: User answer: ${userAnswer} (${typeof userAnswer}), Correct answer: ${question.correctAnswer} (${typeof question.correctAnswer}), Match: ${isCorrect}`);
            
            return (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  !isAnswered ? 'border-gray-200 bg-gray-50' : 
                  isCorrect ? 'border-green-200 bg-green-50' : 
                  'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium flex-1">
                    {index + 1}. {question.text}
                  </h4>
                  <Badge 
                    className={
                      !isAnswered ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : 
                      isCorrect ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                      'bg-red-100 text-red-800 hover:bg-red-100'
                    }
                  >
                    {!isAnswered ? 'Not Answered' : isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>
                
                {viewAnswers && (
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex} 
                        className={`flex items-center p-2 rounded-md ${
                          optionIndex === question.correctAnswer ? 'bg-green-100' : 
                          (userAnswer === optionIndex && userAnswer !== question.correctAnswer) ? 'bg-red-100' : 
                          'bg-white'
                        }`}
                      >
                        <div className="mr-2">
                          {optionIndex === question.correctAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (userAnswer === optionIndex) ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <div className="h-5 w-5"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Link to={`/exams/${examId}`}>
          <Button variant="outline">Back to Exam Page</Button>
        </Link>
        <Link to={`/mock-tests/${examId}`}>
          <Button>Try Again</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default QuestionReview;
