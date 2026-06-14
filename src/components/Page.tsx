import PageHeader from "./PageHeader";

interface PageProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Page({ title, description, children }: PageProps) {
  return (
    <div className="flex-1 min-w-0 flex flex-col bg-background overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <PageHeader title={title} description={description} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 min-w-0 w-full container mx-auto">
          <div className="min-w-0 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;