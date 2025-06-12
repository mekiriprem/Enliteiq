
import { Calendar, Clock, Award, Users } from "lucide-react";

interface ExamQuickInfoProps {
  date: string;
  duration: string;
  fee: string;
  location: string;
}

const ExamQuickInfo = ({ date, duration, fee, location }: ExamQuickInfoProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="text-education-blue h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="text-education-blue h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm text-gray-500">{duration}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="text-education-blue h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Fee</p>
            <p className="text-sm text-gray-500">{fee}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="text-education-blue h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamQuickInfo;
