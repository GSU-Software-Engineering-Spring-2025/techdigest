
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center bg-tech-light-gray py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex justify-center">
              <h1 className="text-3xl font-bold text-tech-purple">TechDigest</h1>
            </Link>
            <h2 className="mt-6 text-center text-xl font-bold text-tech-dark-gray">
              <Outlet />
            </h2>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;
