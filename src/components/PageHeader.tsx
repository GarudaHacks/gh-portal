interface PageHeaderProps {
	pageTitle?: string;
	pageDescription?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
	pageTitle,
	pageDescription,
}) => {
	return (
		<div className="p-10 pb-4 border-b">
			<h1 className="text-2xl font-semibold">{pageTitle}</h1>
			<p className="text-sm">{pageDescription}</p>
		</div>
	);
};

export default PageHeader;
