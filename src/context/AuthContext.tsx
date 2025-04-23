import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "@/components/ui/sonner";
import supabase from "@/lib/supabase";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  // Add additional fields from your profile table if needed
  // For example:
  // avatar_url?: string;
  // bio?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Function to fetch user profile from the database
  const fetchUserProfile = async (
    userId: string,
    email: string,
    name: string
  ) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        // If there's an error, we'll fall back to basic auth info
        return {
          id: userId,
          email,
          name,
        };
      }

      if (data) {
        // Return data from the profiles table, with fallbacks to auth data if needed
        return {
          id: userId,
          email: email,
          name: data.full_name || name,
          // Add any additional fields you want to access from the profiles table
          // avatar_url: data.avatar_url,
          // bio: data.bio,
        };
      }

      return {
        id: userId,
        email,
        name,
      };
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return {
        id: userId,
        email,
        name,
      };
    }
  };

  // Set user from session data and profile
  const setUserFromSession = async (session: any) => {
    if (session?.user) {
      const { id, email, user_metadata } = session.user;
      const name = user_metadata.name || "";

      // Fetch additional user data from the database
      const userData = await fetchUserProfile(id, email!, name);
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserFromSession(session);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserFromSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // User state will be set by the auth state change listener
        toast.success("Logged in successfully!");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    redirectUrl: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success(
          "Account created successfully! Please check your email for verification."
        );

        // Create a profile record in the database
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            email: email,
            full_name: name,
          });

        if (profileError) {
          toast.error("Profile creation failed: " + profileError.message);
          return false;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        setUser(null);
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
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
