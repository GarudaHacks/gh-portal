interface PageHeaderProps {
    title: string, 
    description: string,
}

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="w-full p-10 pb-4 border-b-1 text-[#A83E36]">
        <h1 className="text-[28px] font-semibold">{title}</h1>
        <p className="text-sm">
            {description}
        </p>
    </div>
  )
}

export default PageHeader
