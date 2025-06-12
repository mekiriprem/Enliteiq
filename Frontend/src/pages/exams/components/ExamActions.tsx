
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ExamActionsProps {
  examId: string;
}

const ExamActions = ({ examId }: ExamActionsProps) => {
  return (
    <div className="bg-white px-6 py-4 border-b border-gray-200">
      <div className="flex flex-wrap gap-4">
        <Button className="bg-education-blue hover:bg-blue-700">
          Register for Exam
        </Button>
        <Link to={`/mock-tests/${examId}`}>
          <Button variant="outline" className="border-education-blue text-education-blue hover:bg-blue-50">
            Start Mock Test
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ExamActions;
