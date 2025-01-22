import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { WaveDivider } from "@/components/landing/wave-divider";
import { TestimonialsCarousel } from "@/components/landing/testimonials-carousel";
import { FAQSection } from "@/components/landing/faq-section";
import { NewsletterSection } from "@/components/landing/newsletter-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WaveDivider />
      <FeaturesGrid />
      <TestimonialsCarousel />
      <FAQSection />
      <NewsletterSection />
    </>
  );
}
