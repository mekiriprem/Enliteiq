
import { CheckCircle, AlertCircle } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";

interface ExamOverviewTabProps {
  description: string;
  eligibility: string;
  registrationDeadline: string;
  examDate: string;
}

const ExamOverviewTab = ({ 
  description, 
  eligibility, 
  registrationDeadline, 
  examDate 
}: ExamOverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-3">About this Exam</h2>
        <p className="text-gray-700">{description}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Eligibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{eligibility}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Registration Deadline:</dt>
              <dd>{registrationDeadline}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Exam Date:</dt>
              <dd>{examDate}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamOverviewTab;
