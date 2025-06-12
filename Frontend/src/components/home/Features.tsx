
import { BookOpen, Award, Users, Clock, CheckCircle, BarChart } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-education-blue" />,
      title: "Comprehensive Study Material",
      description: "Access high-quality content curated by education experts to help you prepare effectively."
    },
    {
      icon: <Award className="h-8 w-8 text-education-blue" />,
      title: "Accredited Exams",
      description: "Our exams are recognized by top educational institutions around the world."
    },
    {
      icon: <Users className="h-8 w-8 text-education-blue" />,
      title: "Expert Instructors",
      description: "Learn from qualified educators with years of teaching and examination experience."
    },
    {
      icon: <Clock className="h-8 w-8 text-education-blue" />,
      title: "Flexible Scheduling",
      description: "Take mock tests and practice at your own pace, anytime and anywhere."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-education-blue" />,
      title: "Instant Feedback",
      description: "Get immediate results and detailed explanations after completing your tests."
    },
    {
      icon: <BarChart className="h-8 w-8 text-education-blue" />,
      title: "Performance Tracking",
      description: "Monitor your progress with detailed analytics and personalized insights."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="education-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-education-dark mb-4">Why Choose EduVerse?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform offers everything you need to excel in your academic pursuits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-education-dark">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
