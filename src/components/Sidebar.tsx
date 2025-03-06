import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
// @ts-ignore
import { useAuth } from "../context/AuthContext";
import SidebarTab from "./SidebarTab";

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

	return (
		<div className="min-h-screen bg-[#9F3737] min-w-[15rem] w-[15rem] flex flex-col justify-between">
			<div className="p-6">
				<div className="text-[#FFF7F2]">
					<Link to="/home">
						<img
							src="/images/logo/gh_logo.svg"
							width={40}
							height={60}
							className="mb-4"
						/>
					</Link>
				</div>
			</div>

			<div className="flex-1">
				<nav className="py-2">
					<SidebarTab name="Home" iconUrl="/images/icons/cottage.svg" />
					<SidebarTab name="Schedule" iconUrl="/images/icons/calendar_month.svg" />
					<SidebarTab name="Ticket" iconUrl="/images/icons/confirmation_number.svg" />
					<SidebarTab name="Mentorship" iconUrl="/images/icons/group_search.svg" />
					<SidebarTab name="FAQ" iconUrl="/images/icons/contact_support.svg" />
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
