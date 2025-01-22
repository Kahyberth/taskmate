import { SiteHeader } from "@/components/dashboard/site-header"
import { SiteFooter } from "@/components/dashboard/site-footer"
import { ScrollToTop } from "@/components/landing/scroll-to-top"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            {children}
          </main>
          <ScrollToTop />
          <SiteFooter />
        </div>
  )
}

