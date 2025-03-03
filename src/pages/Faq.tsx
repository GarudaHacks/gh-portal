import Sidebar from "../components/Sidebar";
function Faq() {
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 bg-[#FFF7F2] text-[#9F3737]">
				<div className="p-10 pb-4 border-b-1">
					<h1 className="text-[28px] font-[600]">Frequently Asked Questions</h1>
					<p className="text-[14px]">
						More on logistics, general hacker questions, and beyond.
					</p>
				</div>
			</div>
		</div>
	);
}

export default Faq;
