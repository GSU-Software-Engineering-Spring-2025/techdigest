
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-tech-purple">TechDigest</h1>
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                onClick={logout}
                variant="outline"
              >
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-3 border-t border-gray-200">
            <div className="space-y-2">
              {isAuthenticated ? (
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="w-full"
                >
                  Logout
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" className="block">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
