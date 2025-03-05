import PageHeader from "./PageHeader"
import Sidebar from "./Sidebar"

interface PageProps {
  title: string, 
  description: string
  children: React.ReactNode
}

function Page({ title, description, children }:PageProps) {
  return (
    <div className="flex min-w-screen">
        <Sidebar />
        <div className="w-full">
          <PageHeader title={title} description={description} />
          <div className="px-4 py-4">
              {children}
          </div>
        </div>
    </div>
  )
}

export default Page