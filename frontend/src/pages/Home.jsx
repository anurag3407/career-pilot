import Navbar from '../components/Navbar'
import HeroSection from '../components/ui/HeroSection'
import OurToolsSection from '../components/landing/OurToolsSection'
import FeaturesSection, { AdditionalFeatures } from '../components/ui/FeaturesSection'
import PortfolioShowcaseSection from '../components/ui/PortfolioShowcaseSection'
import ProjectVisualizerSection from '../components/ui/ProjectVisualizerSection'
import HowItWorksSection from '../components/ui/HowItWorksSection'
import TestimonialsSection from '../components/ui/TestimonialsSection'
import CTASection from '../components/ui/CTASection'
import Footer from '../components/ui/Footer'
import { StackedCircularFooter } from '../components/ui/stacked-circular-footer'
import MultiOrbitIntegrations from '../components/ui/multi-orbit-semi-circle'
import Seo from '../components/Seo'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Seo 
        title="CareerPilot - The AI OS for your career"
        description="Your unfair advantage in the job market. Resume building, portfolio generation, and AI mock interviews."
        keywords="career, jobs, resume builder, AI interview, developer portfolio"
        canonical="https://careerpilot.app"
      />
      <Navbar />

      {/* Hero Section with World Map */}
      <HeroSection />

      {/* Our Tools Section - Premium Feature Cards Grid */}
      <OurToolsSection />

      {/* Platform Features */}
      <div id="features">
        <FeaturesSection />
        <AdditionalFeatures />
      </div>

      {/* Portfolio Showcase Section */}
      <PortfolioShowcaseSection />

      {/* Project Visualizer Section */}
      <ProjectVisualizerSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Integrations */}
      <MultiOrbitIntegrations />

      {/* Footer */}
      <Footer />
     
    </div>
  )
}