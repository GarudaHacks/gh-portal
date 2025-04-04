import PageHeader from "./PageHeader";
import Sidebar from "./Sidebar";

interface PageProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

function Page({ title, description, children }: PageProps) {
	return (
		<div className="flex">
			<Sidebar />
			<div className="w-full overflow-hidden">
				<PageHeader
					title={title}
					description={description}
				/>
				<div className="px-10 py-4 overflow-hidden max-w-full">{children}</div>
			</div>
		</div>
	);
}

export default Page;
