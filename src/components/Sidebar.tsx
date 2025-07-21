import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SidebarTab from "./SidebarTab";
import toast from "react-hot-toast";
import { UserApplicationStatus } from "../types/applicationStatus";
import { LogOut } from "lucide-react";
import { Badge } from "./ui/badge";
import { UserRole } from "@/types/auth";
import { Button } from "./ui/button";

interface SidebarProps {
  onSidebarToggle?: (isOpen: boolean) => void;
}

function Sidebar({ onSidebarToggle }: SidebarProps = {}) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, signOut, applicationStatus, role } = useAuth();

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
    applicationStatus === UserApplicationStatus.CONFIRMED_RSVP ||
    role === UserRole.MENTOR;

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
        className={`min-h-screen bg-gradient-to-br from-[#001745] to-[#001745] flex flex-col justify-between fixed md:relative z-40 transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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

            {/* Sidebar if user is a mentor */}
            {role === UserRole.MENTOR ? (
              <>
                <SidebarTab
                  name="Mentoring"
                  iconUrl="/images/icons/group_search.svg"
                  disabled={!canAccessRestrictedPages}
                />
                <SidebarTab
                  name="Schedules"
                  iconUrl="/images/icons/group_search.svg"
                  disabled={!canAccessRestrictedPages}
                />
              </>
            ) : (
              <>
                <SidebarTab
                  name="Schedule"
                  iconUrl="/images/icons/calendar_month.svg"
                  disabled={!canAccessRestrictedPages}
                />

                {/* <SidebarTab
                  name="Ticket"
                  iconUrl="/images/icons/confirmation_number.svg"
                  disabled={!canAccessRestrictedPages}
                /> */}

                <SidebarTab
                  name="Mentorship"
                  iconUrl="/images/icons/group_search.svg"
                  disabled={!canAccessRestrictedPages}
                />
                <SidebarTab
                  name="FAQ"
                  iconUrl="/images/icons/contact_support.svg"
                />
              </>
            )}

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
          <div className="flex flex-col items-center justify-between">
            <div className="flex flex-col gap-4 w-full">
              <Badge variant={"default"} className="text-white">{role.toUpperCase()}</Badge>
              <div className="text-white font-medium">
                <p>{user?.displayName || "Guest"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                className="rounded-full"
                size={"sm"}
                variant={"outline"}
              >
                Log out
                <LogOut />
              </Button>
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
