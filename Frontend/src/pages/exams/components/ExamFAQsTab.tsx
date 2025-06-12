
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { ExamFAQ } from "../types";

interface ExamFAQsTabProps {
  faqs: ExamFAQ[];
}

const ExamFAQsTab = ({ faqs }: ExamFAQsTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-3">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExamFAQsTab;
