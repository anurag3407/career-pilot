import Navbar from '../components/Navbar'
import HeroSection from '../components/ui/HeroSection'
import FeaturesSection, { AdditionalFeatures } from '../components/ui/FeaturesSection'
import PortfolioShowcaseSection from '../components/ui/PortfolioShowcaseSection'
import HowItWorksSection from '../components/ui/HowItWorksSection'
import TestimonialsSection from '../components/ui/TestimonialsSection'
import CTASection from '../components/ui/CTASection'
import Footer from '../components/ui/Footer'
import { StackedCircularFooter } from '../components/ui/stacked-circular-footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section with World Map */}
      <HeroSection />

      {/* Main Features Section - Bento Grid */}
      <section id="features" className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
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
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        <div className="relative">
          <TestimonialsSection />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <StackedCircularFooter />
    </div>
  )
}