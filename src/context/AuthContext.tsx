
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock successful login for demo
      if (email === 'user@example.com' && password === 'password') {
        setUser({
          id: '1',
          name: 'Demo User',
          email: email,
        });
        
        toast.success("Logged in successfully!");
        return true;
      }
      
      toast.error("Invalid email or password");
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setUser({
        id: '1',
        name: name,
        email: email,
      });
      
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    // TODO: Replace with actual API call if needed
    setUser(null);
    toast.success("Logged out successfully!");
  };

  const value = {
    user,
    isAuthenticated: user !== null,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
