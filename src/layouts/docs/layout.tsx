import { SiteHeader } from "@/components/dashboard/site-header"
import { SiteFooter } from "@/components/dashboard/site-footer"
import { DocsSidebar } from "@/components/dashboard/docs-sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col mx-4">
      <SiteHeader />
      <div className="container flex-1">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr]">
          <DocsSidebar />
          <main className="relative py-12">{children}</main>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}

