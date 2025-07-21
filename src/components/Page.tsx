import PageHeader from "./PageHeader";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

interface PageProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Page({ title, description, children }: PageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <div className="flex h-screen text-white bg-gradient-to-tr from-[#020f2a] to-[#001745] overflow-hidden">
      <Sidebar onSidebarToggle={(isOpen) => setSidebarOpen(isOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <PageHeader title={title} description={description} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 min-w-0">
          <div className="min-w-0 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;