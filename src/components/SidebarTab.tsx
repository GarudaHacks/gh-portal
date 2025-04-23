import { Link, useLocation } from "react-router-dom";

interface SidebarTabProps {
	name: string;
	iconUrl: string;
}

function SidebarTab({ name, iconUrl }: SidebarTabProps) {
	const location = useLocation();

	const isActive = (path: string): boolean => {
		return location.pathname === path;
	};

	const path = "/" + name.toLowerCase();

	return (
		<Link
			to={path}
			className={`px-3 md:px-4 py-2 md:py-3 flex items-center text-white ${
				isActive(path) ? "bg-[#920B0B]" : "hover:bg-[#B25F5F]"
			}`}
		>
			<img
				src={iconUrl}
				width={20}
				height={20}
				className="mr-2"
			/>
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
