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
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar onSidebarToggle={(isOpen) => setSidebarOpen(isOpen)} />
      <div
        className={`flex-1 overflow-hidden transition-all duration-300 ${
          isMobile ? "pl-0" : "md:pl-[0rem]"
        } ${isMobile && sidebarOpen ? "filter blur-sm" : ""}`}
      >
        <PageHeader title={title} description={description} />
        <div className="px-4 md:px-10 py-4 overflow-hidden max-w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Page;
