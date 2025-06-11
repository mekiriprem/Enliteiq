
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle } from "lucide-react";
import { Question } from "../types";

interface QuestionContentProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  testSubmitted: boolean;
  handleSelectAnswer: (answerIndex: number) => void;
  handlePrevious: () => void;
  handleSaveAndNext: () => void;
  toggleMarkForReview: () => void;
  isMarkedForReview: boolean;
}

const QuestionContent = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  testSubmitted,
  handleSelectAnswer,
  handlePrevious,
  handleSaveAndNext,
  toggleMarkForReview,
  isMarkedForReview
}: QuestionContentProps) => {

  if (testSubmitted) {
    return (
      <Card className="h-full">
        <div className="flex flex-col items-center justify-center h-64 p-6">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Test Submitted!</h2>
          <p className="text-gray-600 text-center">
            Your answers have been successfully submitted. Redirecting to results...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b">        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          {question.difficulty && (
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" 
              style={{ 
                borderColor: question.difficulty === 'easy' ? '#86EFAC' : 
                           question.difficulty === 'medium' ? '#FDE68A' : '#FCA5A5',
                backgroundColor: question.difficulty === 'easy' ? '#DCFCE7' : 
                               question.difficulty === 'medium' ? '#FEF9C3' : '#FEE2E2',
                color: question.difficulty === 'easy' ? '#166534' : 
                     question.difficulty === 'medium' ? '#854D0E' : '#991B1B'
              }}
            >
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
          )}
        </div>
        <CardTitle>{question.questionText}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup 
          value={selectedAnswer?.toString() || ""} 
          onValueChange={(value) => handleSelectAnswer(parseInt(value))}
        >
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="text-base">{option}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-wrap justify-between gap-2">
        <div>
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={toggleMarkForReview}
            className={isMarkedForReview ? "bg-yellow-50 text-yellow-700 border-yellow-300" : ""}
          >
            {isMarkedForReview ? "Unmark for Review" : "Mark for Review"}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSaveAndNext}
            disabled={currentQuestion === totalQuestions - 1}
            className="flex items-center"
          >
            <Save className="mr-1 h-4 w-4" /> Save & Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionContent;
