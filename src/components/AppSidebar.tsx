import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserApplicationStatus } from "../types/applicationStatus";
import { UserRole } from "@/types/auth";
import { BetweenVerticalEnd, Calendar, Handshake, House, LogOut, User } from "lucide-react";
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import React from "react";

interface NavItem {
  name: string
  path: string
  icon: React.ReactNode
  restricted?: boolean
}

export function AppSidebar() {
  const { user, signOut, applicationStatus, role } = useAuth();
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const canAccess =
    applicationStatus === UserApplicationStatus.ACCEPTED ||
    applicationStatus === UserApplicationStatus.CONFIRMED_RSVP ||
    role === UserRole.MENTOR;

  const canAccessMentorship = applicationStatus === UserApplicationStatus.CONFIRMED_RSVP;

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

  const navItems: NavItem[] =
    role === UserRole.MENTOR
      ? [
        { name: "Home", path: "/home", icon: <House /> },
        { name: "Mentoring", path: "/mentoring", icon: <Handshake /> },
        { name: "Schedules", path: "/schedules", icon: <Calendar /> },
        // { name: "Account", path: "/account", icon: <User /> }, // mentor account is involuntary made
      ]
      : [
        { name: "Home", path: "/home", icon: <House /> },
        // { name: "Schedule", path: "/schedule", icon: "/images/icons/calendar_month.svg", restricted: true },
        { name: "Mentorship", path: "/mentorship", icon: <Handshake /> },
        // { name: "FAQ", path: "/faq", icon: "/images/icons/contact_support.svg" },
        { name: "Find My Table", path: "/my-table", icon: <BetweenVerticalEnd /> },
        { name: "Account", path: "/account", icon: <User /> },
      ];

  if (["/auth", "/terms", "/privacy"].includes(location.pathname)) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-6 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
        <Link to="/home">
          <img src="/images/logo/gh_logo.svg" width={40} height={60} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ name, path, icon, restricted }) => {
                const disabled =
                  !!restricted &&
                  (path === "/mentorship" ? !canAccessMentorship : !canAccess);
                return (
                  <SidebarMenuItem key={name} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild={!disabled}
                      isActive={location.pathname === path}
                      disabled={disabled}
                      size="lg"
                      tooltip={name}
                      className="text-sidebar-foreground py-4 group-data-[collapsible=icon]:justify-center"
                    >
                      {disabled ? (
                        <span className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                          {icon}
                          <span className="group-data-[collapsible=icon]:hidden">{name}</span>
                        </span>
                      ) : (
                        <Link to={path} onClick={() => setOpenMobile(false)}>
                          {icon}
                          <span className="group-data-[collapsible=icon]:hidden">{name}</span>
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
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex flex-col gap-3 p-4 group-data-[collapsible=icon]:hidden">
          <div className="text-sidebar-foreground font-medium">
            <p>{user?.displayName || "Guest"}</p>
            <p className="text-xs opacity-60">{user?.email}</p>
          </div>
          <Button onClick={handleLogout} className="rounded-full" size="sm">
            Log out <LogOut />
          </Button>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex justify-center p-2">
          <Button onClick={handleLogout} size="icon" variant="ghost" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
