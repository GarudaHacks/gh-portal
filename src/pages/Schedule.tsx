import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";

function Schedule() {
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 bg-[#FFF7F2] text-[#9F3737]">
				<PageHeader
					pageTitle="Schedule"
					pageDescription="View the schedule for this weekend!"
				/>
			</div>
		</div>
	);
}

export default Schedule;
