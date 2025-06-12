import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { ExamData } from "../types";

interface InstructionsProps {
  examData: ExamData;
  onStartTest: () => void;
}

const Instructions = ({ examData, onStartTest }: InstructionsProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">{examData.title}</CardTitle>
          <p className="text-blue-100">Please read the instructions carefully before starting</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Exam Details */}
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{examData.duration} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="font-semibold">{examData.totalQuestions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold">{examData.subject}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Instructions:</h3>
            <ul className="space-y-2">
              {examData.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• The test will automatically submit when time expires</li>
                  <li>• Your progress is automatically saved</li>
                  <li>• Ensure stable internet connection throughout the test</li>
                  <li>• Do not refresh or close the browser during the test</li>
                  <li>• Test will be conducted in fullscreen mode for better experience</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
              I have read and understood all the instructions. I agree to follow the test guidelines and understand that any violation may result in disqualification.
            </label>
          </div>
        </CardContent>
        
        <CardFooter className="justify-center border-t bg-gray-50 rounded-b-lg">
          <Button 
            onClick={onStartTest}
            disabled={!agreedToTerms}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-2 text-lg font-medium"
          >
            Start Mock Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Instructions;
