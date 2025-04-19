
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-tech-light-gray flex flex-col">
      {isAuthenticated ? (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="container px-4 py-8 mx-auto flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="container px-4 py-8 mx-auto flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
