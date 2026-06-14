import { usePortfolio } from "../../../../context/PortfolioContext";
/**
 * Wildflower Field — Portfolio Template
 * A watercolor-inspired, botanical portfolio with soft spring palette,
 * floating flowers, organic shapes, and elegant serif typography.
 *
 * Folder: frontend/src/components/portfolio/templates/Wildflower_Field/
 */

import { useEffect } from "react";

import NavBar from "./NavBar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ExperienceSection from "./ExperienceSection";
import TestimonialsSection from "./TestimonialsSection";
import ContactSection from "./ContactSection";

export default function WildflowerField() {
  const { portfolioData: data } = usePortfolio();

  // Inject Google Fonts (Playfair Display + Cormorant Garamond)
  useEffect(() => {
    const linkId = "wildflower-fonts";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap";
      document.head.appendChild(link);
    }

    // Smooth scroll behavior for the whole page
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        background: "#fdf6f0",
        overflowX: "hidden",
      }}
    >
      {/* Floating navigation */}
      <NavBar name={data.personal.name} />

      {/* Page sections */}
      <main>
        <HeroSection data={data} />
        <AboutSection data={data} />
        <SkillsSection data={data} />
        <ProjectsSection data={data} />
        <ExperienceSection data={data} />
        <TestimonialsSection data={data} />
        <ContactSection data={data} />
      </main>
    </div>
  );
}
