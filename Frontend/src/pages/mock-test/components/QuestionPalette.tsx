
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getQuestionStatusClass } from "../utils";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  markedForReview: boolean[];
  goToQuestion: (index: number) => void;
  handleSubmitTest: () => void;
}

const QuestionPalette = ({
  totalQuestions,
  currentQuestion,
  selectedAnswers,
  markedForReview,
  goToQuestion,
  handleSubmitTest
}: QuestionPaletteProps) => {
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-lg">Question Palette</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-full aspect-square flex items-center justify-center text-sm font-medium border rounded-md
                ${getQuestionStatusClass(selectedAnswers[index] !== null, markedForReview[index])}
                ${currentQuestion === index ? 'ring-2 ring-education-blue' : ''}
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 space-y-2 text-sm">
          <p className="font-medium mb-2">Legend:</p>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-gray-100 border border-gray-300 rounded-sm mr-2"></span>
            <span>Not Answered</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-green-100 border border-green-300 rounded-sm mr-2"></span>
            <span>Answered</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-yellow-100 border border-yellow-300 rounded-sm mr-2"></span>
            <span>Marked for Review</span>
          </div>
        </div>
        
        {/* Submit button */}
        <div className="mt-6">
          <Button 
            onClick={handleSubmitTest} 
            className="w-full bg-education-blue hover:bg-blue-700"
          >
            Submit Test
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            Click to submit your answers. You cannot change your answers after submission.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionPalette;
