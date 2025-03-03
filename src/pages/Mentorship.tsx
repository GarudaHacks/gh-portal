import Sidebar from "../components/Sidebar";
function Mentorship() {
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 bg-[#FFF7F2] text-[#9F3737]">
				<div className="p-10 pb-4 border-b-1">
					<h1 className="text-[28px] font-[600]">Mentorship</h1>
					<p className="text-[14px]">
						Submit a request or question to a mentor for help on your project.
					</p>
				</div>
			</div>
		</div>
	);
}

export default Mentorship;
