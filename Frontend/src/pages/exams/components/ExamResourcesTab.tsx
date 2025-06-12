
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { ExamResource } from "../types";

interface ExamResourcesTabProps {
  resources: ExamResource[];
}

const ExamResourcesTab = ({ resources }: ExamResourcesTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-3">Study Resources</h2>
      <p className="text-gray-700 mb-6">
        Here are some recommended resources to help you prepare for the exam.
      </p>
      
      <div className="space-y-6">
        {resources.map((resource, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {resource.items.map((item, idx) => (
                  <li key={idx} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExamResourcesTab;
