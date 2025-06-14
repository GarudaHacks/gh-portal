interface PageHeaderProps {
  title: string;
  description: string;
}

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="w-full px-4 py-8 pb-4 border-b-1 text-white">
      <h1 className="text-[28px] font-semibold text-balance">{title}</h1>
      <p className="text-sm text-balance">{description}</p>
    </div>
  );
}

export default PageHeader;
