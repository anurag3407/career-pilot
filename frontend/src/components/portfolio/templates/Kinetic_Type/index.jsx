import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
 main
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

 main

/**
 * Kinetic Type Portfolio Template
 * Category: Animated / Motion
 * Description: Typography-driven portfolio where text is the star. Words animate, scale, rotate, and transform. Minimal imagery, let animated typography tell the story.
 * 
 * Sections:
 * - Hero: Animated introduction with name and title
 * - About: Personal bio, avatar, and stats
 * - Skills: Categorized skills with progress bars
 * - Projects: Featured projects showcase
 * - Experience: Career timeline
 * - Testimonials: Client and colleague testimonials
 * - Contact: Contact form and social links
 */
export default function KineticType() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
    </div>
  );
}
