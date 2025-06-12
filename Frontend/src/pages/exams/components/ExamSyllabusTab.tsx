
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { ExamSyllabusSection } from "../types";

interface ExamSyllabusTabProps {
  syllabus: ExamSyllabusSection[];
}

const ExamSyllabusTab = ({ syllabus }: ExamSyllabusTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-3">Exam Syllabus</h2>
      <p className="text-gray-700 mb-6">
        The syllabus covers the following topics. Make sure to prepare thoroughly for each section.
      </p>
      
      <div className="space-y-6">
        {syllabus.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {section.topics.map((topic, idx) => (
                  <li key={idx} className="text-gray-700">{topic}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExamSyllabusTab;
