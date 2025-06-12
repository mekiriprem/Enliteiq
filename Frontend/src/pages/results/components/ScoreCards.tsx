
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, ArrowUpCircle, Clock } from "lucide-react";
import { formatTime } from "../utils";

interface ScoreCardsProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  rankData: {
    rank: number;
    totalParticipants: number;
    percentile: number;
  };
}

const ScoreCards = ({ 
  score, 
  correctAnswers, 
  totalQuestions, 
  timeSpent, 
  rankData 
}: ScoreCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-t-4 border-t-education-blue">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Award className="mr-2 h-5 w-5 text-education-blue" /> 
            Your Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-education-dark">
            {score}%
          </div>
          <Progress value={score} className="h-2 mt-2" />
          <p className="text-gray-500 text-sm mt-2">
            {correctAnswers} correct out of {totalQuestions} questions
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-t-4 border-t-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <ArrowUpCircle className="mr-2 h-5 w-5 text-green-500" /> 
            Your Rank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-education-dark">
            {rankData.rank}<span className="text-base font-normal text-gray-500">/{rankData.totalParticipants}</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            You are in the top {rankData.percentile}th percentile
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-t-4 border-t-yellow-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Clock className="mr-2 h-5 w-5 text-yellow-500" /> 
            Time Spent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-education-dark">
            {formatTime(timeSpent)}
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Average: {Math.round(timeSpent / totalQuestions)} seconds per question
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreCards;
