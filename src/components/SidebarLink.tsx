import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
	to: string;
	iconSrc: string;
	label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, iconSrc, label }) => {
	const location = useLocation();

	const isActive = (path: string): boolean => {
		return location.pathname === path;
	};
	return (
		<Link
			to={to}
			className={`p-2 rounded-lg flex items-center ${
				isActive(to) ? "bg-[#920B0B]" : "hover:bg-[#B25F5F]"
			}`}
		>
			<img
				src={iconSrc}
				width={20}
				height={20}
				className="mr-2"
				alt={`${label} icon`}
			/>
			<span
				className={`text-lg ${isActive(to) ? "font-semibold" : "font-normal"}`}
			>
				{label}
			</span>
		</Link>
	);
};

export default SidebarLink;
