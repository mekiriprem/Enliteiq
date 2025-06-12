
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import { formatTime } from "../utils";

interface TimerProgressProps {
  timeLeft: number;
  progress: number;
  answeredQuestions: number;
  totalQuestions: number;
}

const TimerProgress = ({ 
  timeLeft, 
  progress, 
  answeredQuestions, 
  totalQuestions 
}: TimerProgressProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Time Left</CardTitle>
          <span className="text-xl font-semibold flex items-center">
            <Clock className="mr-1.5 h-5 w-5 text-red-500" />
            {formatTime(timeLeft)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500 mb-2">Progress</p>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-500 mt-2 text-right">
          {answeredQuestions} of {totalQuestions} questions answered
        </p>
      </CardContent>
    </Card>
  );
};

export default TimerProgress;
