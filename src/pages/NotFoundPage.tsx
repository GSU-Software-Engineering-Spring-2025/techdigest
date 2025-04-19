
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const NotFoundPage = () => {
  useEffect(() => {
    document.title = "Page Not Found - TechDigest";
  }, []);
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-tech-purple">404</h1>
      <h2 className="text-3xl font-bold text-tech-dark-gray mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
