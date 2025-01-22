import { SiteHeader } from "@/components/dashboard/site-header"
import { HeroSection } from "@/components/dashboard/hero-section"
import { FeaturesGrid } from "@/components/dashboard/features-grid"
import { WaveDivider } from "@/components/dashboard/wave-divider"
import { StatsSection } from "@/components/dashboard/stats-section"
import { TestimonialsCarousel } from "@/components/dashboard/testimonials-carousel"
import { FeaturesComparison } from "@/components/dashboard/features-comparison"
import { FAQSection } from "@/components/dashboard/faq-section"
import { NewsletterSection } from "@/components/dashboard/newsletter-section"
import { ScrollToTop } from "@/components/dashboard/scroll-to-top"
import { SiteFooter } from "@/components/dashboard/site-footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <WaveDivider />
        <StatsSection />
        <FeaturesGrid />
        <TestimonialsCarousel />
        <FeaturesComparison />
        <FAQSection />
        <NewsletterSection />
      </main>
      <ScrollToTop />
      <SiteFooter />
    </div>
  )
}

