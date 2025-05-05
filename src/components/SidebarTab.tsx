import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarTabProps {
  name: string;
  iconUrl: string;
  disabled?: boolean;
}

function SidebarTab({ name, iconUrl, disabled }: SidebarTabProps) {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return !disabled && location.pathname === path;
  };

  const path = "/" + name.toLowerCase();

  const commonClasses =
    "px-3 md:px-4 py-2 md:py-3 flex items-center text-white";

  const activeClasses = "bg-[#920B0B]";
  const inactiveHoverClasses = "hover:bg-[#B25F5F]";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  const content = (
    <>
      <img src={iconUrl} width={20} height={20} className="mr-2" />
      <span
        className={`text-base md:text-lg ${
          isActive(path) ? "font-semibold" : "font-normal"
        }`}
      >
        {name}
      </span>
    </>
  );

  if (disabled) {
    return <div className={cn(commonClasses, disabledClasses)}>{content}</div>;
  }

  return (
    <Link
      to={path}
      className={cn(
        commonClasses,
        isActive(path) ? activeClasses : inactiveHoverClasses
      )}
    >
      {content}
    </Link>
  );
}

export default SidebarTab;
