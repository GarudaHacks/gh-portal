interface PageHeader {
    title: string, 
    description: string,
}

function PageHeader({ title, description }: PageHeader) {
  return (
    <div className="w-full p-10 pb-4 border-b-1 text-primary">
        <h1 className="text-[28px] font-semibold">{title}</h1>
        <p className="text-sm">
            {description}
        </p>
    </div>
  )
}

export default PageHeader
