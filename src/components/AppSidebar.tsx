import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserApplicationStatus } from "../types/applicationStatus";
import { UserRole } from "@/types/auth";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function AppSidebar() {
  const { user, signOut, applicationStatus, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const canAccess =
    applicationStatus === UserApplicationStatus.ACCEPTED ||
    applicationStatus === UserApplicationStatus.CONFIRMED_RSVP ||
    role === UserRole.MENTOR;

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      navigate("/auth");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const navItems =
    role === UserRole.MENTOR
      ? [
          { name: "Home", path: "/home", icon: "/images/icons/cottage.svg" },
          { name: "Mentoring", path: "/mentoring", icon: "/images/icons/group_search.svg", restricted: true },
          { name: "Schedules", path: "/schedules", icon: "/images/icons/calendar_month.svg", restricted: true },
        ]
      : [
          { name: "Home", path: "/home", icon: "/images/icons/cottage.svg" },
          { name: "Schedule", path: "/schedule", icon: "/images/icons/calendar_month.svg", restricted: true },
          { name: "Mentorship", path: "/mentorship", icon: "/images/icons/group_search.svg", restricted: true },
          { name: "FAQ", path: "/faq", icon: "/images/icons/contact_support.svg" },
        ];

  if (location.pathname === "/auth") return null; // Don't render on /auth

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <Link to="/home">
          <img src="/images/logo/gh_logo.svg" width={40} height={60} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ name, path, icon, restricted }) => {
                const disabled = !!restricted && !canAccess;
                return (
                  <SidebarMenuItem key={name}>
                    <SidebarMenuButton
                      asChild={!disabled}
                      isActive={location.pathname === path}
                      disabled={disabled}
                      className="text-white text-base py-4"
                    >
                      {disabled ? (
                        <span className="flex items-center gap-2 opacity-70 cursor-not-allowed">
                          <img src={icon} width={20} height={20} />
                          {name}
                        </span>
                      ) : (
                        <Link to={path} className="flex items-center gap-2">
                          <img src={icon} width={20} height={20} />
                          {name}
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white">
        <div className="flex flex-col gap-4">
          <Badge variant="default" className="text-white w-fit">
            {role.toUpperCase()}
          </Badge>
          <div className="text-white font-medium">
            <p>{user?.displayName || "Guest"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button onClick={handleLogout} className="rounded-full" size="sm" variant="outline">
            Log out <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
