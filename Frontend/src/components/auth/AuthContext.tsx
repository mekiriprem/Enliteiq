import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "student" | "school" | "salesman" | "user";
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user data on app load
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        // Check localStorage first (remember me)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsLoading(false);
          return;
        }

        // Check sessionStorage (temporary login)
        const sessionUser = sessionStorage.getItem("user");
        if (sessionUser) {
          const userData = JSON.parse(sessionUser);
          setUser(userData);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        setIsLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Store in localStorage for persistence (can be modified based on "remember me")
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Clear all stored data
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
