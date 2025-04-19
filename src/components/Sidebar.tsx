
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, BookOpen, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Categories", path: "/categories", icon: BookOpen },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex justify-between items-center">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-tech-purple">TechDigest</h1>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
      
      <nav className="flex-1 pt-5">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100",
                  location.pathname === item.path && "bg-gray-100 text-tech-purple border-l-4 border-tech-purple"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4">
        <Button
          variant="outline"
          className={cn("flex items-center justify-center", collapsed ? "w-8 h-8 p-0" : "w-full")}
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
