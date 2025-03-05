import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
function Mentorship() {
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 bg-[#FFF7F2] text-[#9F3737]">
				<PageHeader
					pageTitle="Mentorship"
					pageDescription="Submit a request or question to a mentor for help on your project."
				/>
			</div>
		</div>
	);
}

export default Mentorship;
