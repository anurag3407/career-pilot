import Seo from '../components/Seo'
import FlightNav from '../components/landing/flight/FlightNav'
import Hero from '../components/landing/flight/Hero'
import FeatureStories from '../components/landing/flight/FeatureStories'
import { Templates, Comparison, UseCases } from '../components/landing/flight/Sections'
import { HowItWorks, Faq, FinalCall, FlightFooter } from '../components/landing/flight/Story'

// ---------------------------------------------------------------------------
// Landing page — "Flight Deck" editorial design system (see
// src/styles/flightdeck.css). Hero → one section per feature → templates →
// compare → use cases → how it works → FAQ → final call → footer.
// ---------------------------------------------------------------------------
export default function Home() {
  return (
    <div className="cp-flight min-h-screen bg-background text-foreground antialiased">
      <Seo
        title="CareerPilot — The AI Career OS"
        description="Resumes, mock interviews, job tracking, portfolios, GitHub intelligence and outreach — every career tool in one open-source platform."
        keywords="career, jobs, resume builder, AI interview, developer portfolio, job tracker, open source"
        canonical="https://careerpilot.app"
      />
      <FlightNav />
      <main>
        <Hero />
        <FeatureStories />
        <Templates />
        <Comparison />
        <UseCases />
        <HowItWorks />
        <Faq />
        <FinalCall />
      </main>
      <FlightFooter />
    </div>
  )
}
