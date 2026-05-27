import Navbar from '../components/Navbar'
import HeroSection from '../components/ui/HeroSection'
import FeaturesSection, { AdditionalFeatures } from '../components/ui/FeaturesSection'
import PortfolioShowcaseSection from '../components/ui/PortfolioShowcaseSection'
import HowItWorksSection from '../components/ui/HowItWorksSection'
import TestimonialsSection from '../components/ui/TestimonialsSection'
import CTASection from '../components/ui/CTASection'
import Footer from '../components/ui/Footer'
import { StackedCircularFooter } from '../components/ui/stacked-circular-footer'
import PolygonMorph from '../components/portfolio/templates/Geometric_Shapes/PolygonMorph';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      {/* Hero Section with World Map */}
      <HeroSection />
      <PolygonMorph />

      {/* Main Features Section - Bento Grid */}
      <section id="features" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/50 to-background" />
        <div className="relative px-4 sm:px-6 lg:px-8">
          <FeaturesSection />

          {/* Additional Features Grid */}
          <div className="max-w-7xl mx-auto pb-20">
            <AdditionalFeatures />
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Section */}
      <PortfolioShowcaseSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/50 to-background" />
        <div className="relative">
          <TestimonialsSection />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
     
    </div>
  )
}