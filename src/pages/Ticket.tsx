import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
function Ticket() {
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 bg-[#FFF7F2] text-[#9F3737]">
				<PageHeader
					pageTitle="Ticket"
					pageDescription="View your ticket for the event and register (a.k.a. check in) at Garuda Hacks 6.0."
				/>
			</div>
		</div>
	);
}

export default Ticket;
