import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "./AuthContext";

// Define TypeScript interfaces for better type safety
interface LoginResponse {
  role: string;
  data: {
    id: string | number;
    name: string;
    email: string;
  };
  message?: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "school" | "salesman";
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to validate email
  const isValidEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  // Helper function to validate phone number (10 digits)
  const isValidPhone = (input: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(input);
  };

  // Helper function to determine input type and validate
  const validateInput = (input: string): { isValid: boolean; isEmail: boolean; isPhone: boolean } => {
    const isEmail = isValidEmail(input);
    const isPhone = isValidPhone(input);
    return {
      isValid: isEmail || isPhone,
      isEmail,
      isPhone
    };
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate input
    const { isValid, isEmail, isPhone } = validateInput(emailOrPhone.trim());
    
    if (!isValid) {
      setError("Please enter a valid email address or 10-digit phone number.");
      setIsLoading(false);
      return;
    }    try {
      // Prepare request body based on input type
      const requestBody: { password: string; email?: string; phone?: string } = {
        password,
      };

      if (isEmail) {
        requestBody.email = emailOrPhone.trim();
      } else if (isPhone) {
        requestBody.phone = emailOrPhone.trim();
      }

      const response = await fetch(" https://olympiad-zynlogic.hardikgarg.me/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });if (!response.ok) {        // Handle non-JSON error responses
        let errorMessage = "Invalid credentials. Please try again.";
        
        // Handle specific status codes
        if (response.status === 401) {
          errorMessage = "Invalid credentials. Please check your email/phone and password and try again.";
        } else if (response.status === 403) {
          errorMessage = "Access denied. Please contact support if you believe this is an error.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text();
            if (errorText && errorText.trim()) {              // Check if it's a common error message
              if (errorText.toLowerCase().includes("invalid credentials") || 
                  errorText.toLowerCase().includes("invalid email") || 
                  errorText.toLowerCase().includes("invalid password")) {
                errorMessage = "Invalid credentials. Please check your email/phone and password and try again.";
              } else {
                errorMessage = errorText;
              }
            }
          } catch (textError) {
            // Use default message if both JSON and text parsing fail
            console.error("Error parsing response:", textError);
          }
        }
        throw new Error(errorMessage);
      }

      const data: LoginResponse = await response.json();// Log the raw response for debugging
      console.log("Login successful, raw response:", data);

      // Normalize role to handle inconsistencies (trim and lowercase)
      const role = data.role?.trim().toLowerCase() as UserData["role"];
      console.log("Normalized role:", role);

      // Validate role
      const validRoles: UserData["role"][] = ["admin", "user", "school", "salesman"];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role received: ${role}. Please contact support.`);
      }      // Prepare user data
      const userData: UserData = {
        id: typeof data.data.id === 'string' ? parseInt(data.data.id, 10) : data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: role,
      };

      // Store user data based on remember me preference
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      // Update auth context
      login(userData);      // Redirect based on role
      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "user":
          navigate("/student-dashboard");
          break;
        case "salesman":
          navigate("/sales-dashboard");
          break;
        default:
          throw new Error("Unexpected role, redirecting to default dashboard");
      }    } catch (err: unknown) {
      console.error("Login error:", err);
      let errorMessage = "Login failed. Please try again.";
      
      if (err instanceof Error) {
        // Handle network errors
        if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (err.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-education-dark mb-6">Login to Your Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}        <div className="mb-6">
          <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Email or Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="emailOrPhone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
            placeholder="your@email.com or 1234567890"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
          {emailOrPhone && (
            <div className="mt-1 text-xs">
              {isValidEmail(emailOrPhone.trim()) ? (
                <span className="text-green-600">✓ Valid email format</span>
              ) : isValidPhone(emailOrPhone.trim()) ? (
                <span className="text-green-600">✓ Valid phone format</span>
              ) : (
                <span className="text-red-500">⚠ Please enter a valid email or 10-digit phone number</span>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-education-blue focus:ring-education-blue border-gray-300 rounded"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <Link to="/forgotpassword" className="text-sm text-education-blue hover:text-blue-700">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full btn-primary py-2.5 px-4 text-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-education-blue hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;