import { Link, useLocation } from "react-router-dom";

interface SidebarTabProps {
  name: string;
  iconUrl: string;
  disabled?: boolean;
}

function SidebarTab({ name, iconUrl, disabled }: SidebarTabProps) {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const path = "/" + name.toLowerCase();

  const commonClasses = `px-3 md:px-4 py-2 md:py-3 flex items-center`;
  const activeClasses = "bg-[#920B0B] text-white";
  const inactiveClasses = "text-white hover:bg-[#B25F5F]";
  const disabledClasses = "cursor-not-allowed opacity-70";

  if (disabled) {
    return (
      <div className={`${commonClasses} ${disabledClasses}`}>
        <img src={iconUrl} width={20} height={20} className="mr-2 opacity-70" />
        <span className={`text-base md:text-lg font-normal`}>{name}</span>
      </div>
    );
  }

  return (
    <Link
      to={path}
      className={`${commonClasses} ${
        isActive(path) ? activeClasses : inactiveClasses
      }`}
    >
      <img src={iconUrl} width={20} height={20} className="mr-2" />
      <span
        className={`text-base md:text-lg ${
          isActive(path) ? "font-semibold" : "font-normal"
        }`}
      >
        {name}
      </span>
    </Link>
  );
}

export default SidebarTab;
