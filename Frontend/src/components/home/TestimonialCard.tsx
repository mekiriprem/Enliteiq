
import { Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

const TestimonialCard = ({ name, role, content, avatar, rating }: TestimonialProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover">
      <div className="flex items-center mb-4">
        <img 
          src={avatar} 
          alt={`${name}'s avatar`} 
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-education-dark">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
      
      <p className="text-gray-600 italic">"{content}"</p>
    </div>
  );
};

export default TestimonialCard;
