
import { useState } from "react";
import { User, Users, School, ShieldCheck } from "lucide-react";

interface UserType {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

interface UserTypeSelectorProps {
  onSelect: (type: string) => void;
}

const UserTypeSelector = ({ onSelect }: UserTypeSelectorProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const userTypes: UserType[] = [
    {
      id: "user", // Change to "student" if needed
      title: "User", // Change to "Student" if needed
      description: "Take exams, practice with mock tests, track your progress",
      icon: <User size={24} className="text-education-blue" />
    },
    // {
    //   id: "parent",
    //   title: "Parent",
    //   description: "Monitor your child's progress, register them for exams",
    //   icon: <Users size={24} className="text-education-blue" />
    // },
    // {
    //   id: "school",
    //   title: "School",
    //   description: "Manage student participation, coordinate exams",
    //   icon: <School size={24} className="text-education-blue" />
    // },
    {
      id: "admin",
      title: "Admin",
      description: "Platform administrators only",
      icon: <ShieldCheck size={24} className="text-education-blue" />
    },
  ];

  const handleSelect = (typeId: string) => {
    setSelectedType(typeId);
    onSelect(typeId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-education-dark">
        Select Your User Type
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userTypes.map((type) => (
          <div
            key={type.id}
            className={`border rounded-lg p-5 cursor-pointer transition-all ${
              selectedType === type.id
                ? "border-education-blue bg-blue-50"
                : "border-gray-200 hover:border-education-blue hover:bg-gray-50"
            }`}
            onClick={() => handleSelect(type.id)}
          >
            <div className="flex items-center mb-3">
              <div className="mr-3">{type.icon}</div>
              <h3 className="text-xl font-medium text-education-dark">{type.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelector;
