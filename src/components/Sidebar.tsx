import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SidebarTab from "./SidebarTab";
import toast from "react-hot-toast";
import { UserApplicationStatus } from "../types/applicationStatus";
import { LogOut } from "lucide-react";

interface SidebarProps {
  onSidebarToggle?: (isOpen: boolean) => void;
}

function Sidebar({ onSidebarToggle }: SidebarProps = {}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, signOut, applicationStatus } = useAuth();

  const navigate = useNavigate();

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      const newSidebarState = window.innerWidth >= 768;
      setSidebarOpen(newSidebarState);
      if (onSidebarToggle) {
        onSidebarToggle(newSidebarState);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { data, error } = await signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const canAccessRestrictedPages =
    applicationStatus === UserApplicationStatus.ACCEPTED ||
    applicationStatus === UserApplicationStatus.CONFIRMED_RSVP;

  return (
    <>
      {/* Mobile Toggle Button - Only visible on mobile */}
      {isMobile && (
        <button
          className="fixed top-4 right-4 z-50 bg-background p-2 rounded-md shadow-md"
          onClick={() => {
            const newState = !sidebarOpen;
            setSidebarOpen(newState);
            if (onSidebarToggle) {
              onSidebarToggle(newState);
            }
          }}
        >
          <img
            src="/images/icons/menu.svg"
            width={24}
            height={24}
            alt="Menu"
            className="invert"
          />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`min-h-screen bg-gradient-to-br from-[#001745] to-[#001745] flex flex-col justify-between fixed md:relative z-40 transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isMobile ? "w-[250px]" : "min-w-[15rem] w-[15rem]"}`}
      >
        <div className="p-6">
          <div className="text-[#FFF7F2] flex items-center justify-between">
            <Link to="/home">
              <img
                src="/images/logo/gh_logo.svg"
                width={40}
                height={60}
                className="mb-4"
              />
            </Link>
            {isMobile && (
              <button
                className="text-white p-1"
                onClick={() => {
                  setSidebarOpen(false);
                  if (onSidebarToggle) {
                    onSidebarToggle(false);
                  }
                }}
              >
                <span className="text-xl">&times;</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1">
          <nav className="py-2">
            <SidebarTab name="Home" iconUrl="/images/icons/cottage.svg" />
            <SidebarTab
              name="Schedule"
              iconUrl="/images/icons/calendar_month.svg"
              disabled={!canAccessRestrictedPages}
            />
            <SidebarTab
              name="Ticket"
              iconUrl="/images/icons/confirmation_number.svg"
              disabled={!canAccessRestrictedPages}
            />
            <SidebarTab
              name="Mentorship"
              iconUrl="/images/icons/group_search.svg"
              disabled={!canAccessRestrictedPages}
            />
            <SidebarTab
              name="FAQ"
              iconUrl="/images/icons/contact_support.svg"
            />
            {isMobile && (
              <button
                onClick={handleLogout}
                className="w-fit mt-4 rounded-lg bg-background px-3 md:px-4 py-2 flex items-center text-white active:opacity-80"
              >
                <span className="text-primary font-semibold md:text-lg flex flex-row items-center gap-1">
                  <LogOut className="m-0" />
                  Logout
                </span>
              </button>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-white hidden md:block">
          <div className="flex items-center justify-between">
            <div className="">
              <div className="text-white font-medium">
                {user?.displayName || "Guest"}
              </div>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white hover:bg-[#FF0068] rounded-full"
            >
              <img src="/images/icons/more_vert.svg" width={20} height={20} />
            </button>
          </div>
          <div className="relative">
            <div
              className={`absolute bottom-5 left-20 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-200 ease-in-out origin-bottom-right
							${
                showMenu
                  ? "transform scale-100 opacity-100"
                  : "transform scale-95 opacity-0 pointer-events-none"
              }
						`}
            >
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="flex flex-row items-center gap-1">
                  <LogOut />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile - only visible when sidebar is open on mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-30"
          onClick={() => {
            setSidebarOpen(false);
            if (onSidebarToggle) {
              onSidebarToggle(false);
            }
          }}
        />
      )}
    </>
  );
}

export default Sidebar;
