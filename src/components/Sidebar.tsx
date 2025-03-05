import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import SidebarLink from "./SidebarLink";
// @ts-ignore
import { useAuth } from "../context/AuthContext";
function Sidebar() {
	const [showMenu, setShowMenu] = useState(false);
	const user = useAuth();

	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate("/auth");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const sidebarLinks = [
		{
			to: "/home",
			iconSrc: "/images/icons/cottage.svg",
			label: "Home",
		},
		{
			to: "/schedule",
			iconSrc: "/images/icons/calendar_month.svg",
			label: "Schedule",
		},
		{
			to: "/ticket",
			iconSrc: "/images/icons/confirmation_number.svg",
			label: "Ticket",
		},
		{
			to: "/mentorship",
			iconSrc: "/images/icons/group_search.svg",
			label: "Mentorship",
		},
		{
			to: "/faq",
			iconSrc: "/images/icons/contact_support.svg",
			label: "FAQ",
		},
	];

	return (
		<div className="min-h-screen bg-[#9F3737] w-xs flex flex-col justify-between">
			<div className="p-6">
				<div className="text-[#FFF7F2]">
					<img
						src="/images/logo/gh_logo.svg"
						width={40}
						height={60}
						className="mb-4"
					/>
				</div>
			</div>

			<div className="flex-1">
				<nav className="px-4 py-2">
					{sidebarLinks.map((link) => (
						<SidebarLink
							key={link.to}
							to={link.to}
							iconSrc={link.iconSrc}
							label={link.label}
						/>
					))}
				</nav>
			</div>

			<div className="p-4 border-t border-[#B25F5F]">
				<div className="flex items-center justify-between">
					<div className="">
						<div className="text-white font-medium">
							{user?.user.displayName || "Guest"}
						</div>
					</div>
					<button
						onClick={() => setShowMenu(!showMenu)}
						className="text-white hover:bg-[#B25F5F] rounded-full"
					>
						<img
							src="/images/icons/more_vert.svg"
							width={20}
							height={20}
						/>
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
							Logout
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
