import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
function Faq() {
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 bg-[#FFF7F2] text-[#9F3737]">
				<PageHeader
					pageTitle="FAQ"
					pageDescription="More on logistics, general hacker questions, and beyond."
				/>
			</div>
		</div>
	);
}

export default Faq;
