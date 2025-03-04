import Sidebar from "../components/Sidebar";

function Schedule() {
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 bg-[#FFF7F2] text-[#9F3737]">
				<div className="p-10 pb-4 border-b-1">
					<h1 className="text-[28px] font-[600]">Schedule</h1>
					<p className="text-[14px]">View the schedule for this weekend!</p>
				</div>
			</div>
		</div>
	);
}

export default Schedule;
