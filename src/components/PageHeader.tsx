import { SidebarTrigger } from "./ui/sidebar";

interface PageHeaderProps {
  title: string;
  description: string;
}

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="w-full px-4 py-8 pb-4 border-b-1 flex items-start gap-3">
      <SidebarTrigger className="mt-1 shrink-0" />
      <div>
        <h1 className="text-[28px] font-semibold text-balance">{title}</h1>
        <p className="text-sm text-balance">{description}</p>
      </div>
    </div>
  );
}

export default PageHeader;
