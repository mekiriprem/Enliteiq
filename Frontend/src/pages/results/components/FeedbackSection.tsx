
import { AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FeedbackData } from "../types";

interface FeedbackSectionProps {
  feedback: FeedbackData;
}

const FeedbackSection = ({ feedback }: FeedbackSectionProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-education-blue" />
          Feedback & Improvement Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{feedback.message}</p>
        
        <h4 className="font-semibold mb-2">Suggested Next Steps:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {feedback.suggestions.map((suggestion, index) => (
            <li key={index} className="text-gray-700">{suggestion}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
