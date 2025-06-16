
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen ">
      <div className="container">
        <div className="max-w-md mx-auto text-center mb-8">
      <div className="flex justify-center items-center ">
  <Link to="/" className="flex items-center space-x-2 padding:2px">
    <img
      src="/ChatGPT_Image_Jun_12__2025__10_58_53_AM-removebg-preview.png"
      alt="Enlightiq Logo"
      className="h-12 w-12 object-contain"
    />
   <h1 className="text-5xl font-bold text-yellow-600">Enlightiq</h1>
  </Link>
</div>          <h1 className="mt-6 text-3xl font-bold text-education-dark dark:text-white">Create Your Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Join Enlightiq to start your learning journey</p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-8 text-center">          <p className="text-sm text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-education-blue hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-education-blue hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
